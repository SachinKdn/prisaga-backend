
 const bcrypt = require("bcryptjs")
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UserRole } from "../interfaces/enum";
 import { IUser } from "../interfaces/user"; 
import Agency from "../models/agency";
import User from "../models/user";
import { confirmationAgencyEmailTemplate, resetPasswordEmailTemplate, sendEmail } from "../utils/sendMail";
import { createTokenInUser, createUserTokens, decodeToken } from "./passport-jwt";
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

export const getUserByEmail = async (email: string) => {
    console.log("finding user by mail")
    const user = await User.findOne({ email: email }).lean();
    console.log("finding user ", user)
    return user;
  };
export const createAgencyMainMember = async (userData: IUser) => {
  const user = await User.create(userData);
  user.createdBy =  new mongoose.Types.ObjectId(user._id);
  await user.save();

  return user;
}
export const createUser = async (userData: IUser) => {
    let user = await User.create(userData);
    console.log("\n\n\n createUser------>", user);
    let { password, ...result } = user.toObject();
    if (user.role === UserRole.VENDOR) {
        const populatedUser = await User.findById(user._id)
            .populate('agency')
            .lean();
        if (populatedUser?.agency) {
            result.agency = populatedUser.agency;
        } else {
            result.agency = null;
        }
        if(userData.agency !== null){
            const { accessToken } = await createUserTokens(result!);
            await sendEmail({
                to: user!.email,
                subject: "Reset password at Prisaga Consulting Pvt. Ltd.",
                html: resetPasswordEmailTemplate(accessToken),
              });
            console.log("Email sent successfully....")
        }
    }
    return result;
};
export const sendConfirmationLink = async (userId: string, email: string) => {
  const tokenData = {
    _id: userId
  };
  const jwtSecret = process.env.JWT_SECRET || "TOP_SECRET";
    const accessToken = jwt.sign({ user: tokenData }, jwtSecret, { expiresIn: '7d' });
    const token_expiration = Date.now() + 7 * 24 * 60 * 60 * 1000;
    await User.findByIdAndUpdate(tokenData?._id, { "$set": { token: accessToken, token_expiration } }).lean();
    const result = await sendEmail({
        to: email,
        subject: "Confirmation mail from Prisaga Consulting Pvt. Ltd.",
        html: confirmationAgencyEmailTemplate(accessToken),
        });
    console.log("Email sent successfully....")
    return result;
}
export const createAndInviteUser = async (userData: IUser) => {
    let user = await User.create(userData);
    console.log("\n\n\n createUser------>", user);
    let { password, ...result } = user.toObject();
    // if (user.role === UserRole.VENDOR) {
    //     const populatedUser = await User.findById(user._id)
    //         .populate('agency')
    //         .lean();
    //     if (populatedUser?.agency) {
    //         result.agency = populatedUser.agency;
    //     } else {
    //         result.agency = null;
    //     }
    // }
    console.log("New user result---", result)
    const tokenData = {
        _id: user._id,
        role: user?.role,
      };
    const jwtSecret = process.env.JWT_SECRET || "TOP_SECRET";
    const accessToken = jwt.sign({ user: tokenData }, jwtSecret, { expiresIn: '7d' });
    const token_expiration = Date.now() + 7 * 24 * 60 * 60 * 1000;
    await User.findByIdAndUpdate(tokenData?._id, { "$set": { token: accessToken, token_expiration } }).lean();
    await sendEmail({
        to: user!.email,
        subject: "Reset password at Prisaga Consulting Pvt. Ltd.",
        html: resetPasswordEmailTemplate(accessToken),
        });
    console.log("Email sent successfully....")
    return result;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
  const res = await User.findById(id).populate({ 
    path: 'agency',
    populate: {
      path: 'createdBy',
      model: 'User'
    } 
 });
    return res;
};

export const verifyToken = async (token: string): Promise<IUser | null> => {
  const decodedUser = await decodeToken(token);
  if (!decodedUser) {
    throw createHttpError(403, {
      message: "Token is invalid",
    });
  }
  
  const user = await User.findOne({ token });
  if (!user) {
    throw createHttpError(404, { message: 'Invalid or expired token' });
  }
  if ( user.token_expiration < Date.now()) {
    throw createHttpError(401, { message: 'Invalid or expired token' });
  }
  return user;
};

export const verifyTokenAndUpdate = async (token: string): Promise<IUser | null> => {
    const decodedUser = await decodeToken(token);
    if (!decodedUser) {
      throw createHttpError(403, {
        message: "Token is invalid",
      });
    }
    
    const user = await User.findOne({ token });
    if (!user) {
      throw createHttpError(404, { message: 'Invalid or expired token' });
    }
    if ( user.token_expiration < Date.now()) {
      throw createHttpError(401, { message: 'Invalid or expired token' });
    }
    user.token_expiration = 0;
    user.token = '';
    user.isApproved = true;
    await user.save();
    return user;
};

export const updateUser = async (id: string, userData: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, userData, { new: true });
};


export const uploadAndUpdateImage = async (file: Express.Multer.File, userId: string)=>{
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
      }
    });
    // Create a unique image key
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const fileKey = `profilePictures/${userId}/${timestamp}-${originalName}`;
    // Upload image to S3
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${file.originalname}"`,
    }

    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileKey}`;
    console.log("\n\n\n This is file which are upload--->",fileUrl);
    console.log("\n\n\n userId--->",userId);
    return await User.findByIdAndUpdate(userId, {image: fileUrl}, { new: true });
}


export const deleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, {isDeleted: true}, { new: true } );
};

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  };


  export const getAllUsers = async (filter: any): Promise<IUser | null> => {
    const user = await User.findById("id");
    console.log("getUserById------>", user)
    return user;
};