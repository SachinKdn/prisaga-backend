import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import createError from "http-errors";
import * as userService from "./user.service";
import { IUser } from "../interfaces/user";
import TokenSchema, { IToken } from "../models/token";
import createHttpError from 'http-errors';
import User from "../models/user";
import { NextFunction, Request, Response } from "express";

const isValidPassword = async function (value: string, password: string) {
    const compare = await bcrypt.compare(value, password);
    return compare;
  };

  const jwtOptions = {
    secretOrKey: process.env.JWT_SECRET || "TOP_SECRET",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };
  export const initPassport = (): void => {
    console.log("initPassport block")
    passport.use(
      new Strategy(
        jwtOptions,
        async (token, done) => {
          try {
            console.log("try block")
            done(null, token.user);
          } catch (error) {
            console.log("cathcy block")
            console.log(error)
            done(error);
          }
        }
      )
    );
  
    // user login
    passport.use(
        "login",
        new LocalStrategy(
          {
            usernameField: "email",
            passwordField: "password",
          },
          async (email, password, done) => {
            try {
              const user : IUser | null = await userService.getUserByEmail(email);
              if (user == null) {
                done(createError(401, "Invalid email or password"), false);
                return;
              }
              const validate = await isValidPassword(password, user.password);
              if (!validate) {
                done(createError(401, "Invalid email or password"), false);
                return;
              }
              const { password: _p, ...result } = user;
              done(null, result, { message: "Logged in Successfully" });
            } catch (error: any) {
              done(createError(500, error.message));
            }
          }
        )
      );
  };


   export const createUserTokens = async (user: Omit<IUser, "password">) => {
    const tokenData = {
      _id: user._id,
      role: user?.role,
    };
     const jwtSecret = process.env.JWT_SECRET || "TOP_SECRET";
     const accessToken = jwt.sign({ user: tokenData }, jwtSecret, { expiresIn: '7d' });
     const refreshToken = jwt.sign({ user: tokenData }, jwtSecret, { expiresIn: '7d' });
     const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
     await saveSessionToken( tokenData?._id || "" , { accessToken: accessToken, expireAt, refreshToken })
     return {
       user,
      accessToken,
       refreshToken
     };
   };


export const decodeToken = (token: string): IUser => {
  const jwtSecret = process.env.JWT_SECRET || "TOP_SECRET";
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as IUser;
    return decoded; 
  } catch (error) {
    throw new Error("Invalid token");
  }
};


export const saveSessionToken = async (
  userId: string,
  data: Partial<IToken>
) => {
  try {
    
    const newToken = await TokenSchema.findOneAndUpdate(
      { userId},
      { $set: { accessToken: data.accessToken, expireAt: data.expireAt , refreshToken: data.refreshToken },
        $setOnInsert: {userId} },
      { new: true, upsert: true }).lean().exec();
    console.log("Session Token ========== ", newToken);
    return newToken;
  } catch (error) {
    console.log("error",error);
    
    throw createHttpError(500, {
      message: "Something went wrong in saving session token",
    });
  }
};


export const isUserToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the token from the authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // If no token is provided, return a 401 error
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required"
      });
      return;
    }

    // Find token in the database to check its validity
    const isTokenValid = await TokenSchema.findOne({ accessToken: token });

    // If token doesn't exist or it's expired, return a 401 error
    if (!isTokenValid || isTokenValid.expireAt.getTime() < Date.now()) {
      res.status(401).json({
        success: false,
        message: "Token is invalid or expired, please login again"
      });
      return;
    }

    // Check if passport has correctly set the user object on req.user
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated, please login again"
      });
      return;
    }

    // Find the user by ID and ensure they are not deleted
    console.log( req.user._id)
    const user: IUser | null = await userService.getUserById(req.user?._id!);
  console.log("user", user)
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found or has been deleted"
      });
      return;
    }

    // If everything is valid, proceed to the next middleware
    next();
  } catch (error) {
    // Log the actual error for debugging purposes
    console.error('Authentication middleware error:', error);
    
    // Send a generic error response
    res.status(500).json({
      success: false,
      message: "Authentication failed due to server error"
    });
  }
};