import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import createHttpError from "http-errors";
import { createResponse } from "../helper/response";
import { createUserTokens, decodeToken } from "../services/passport-jwt";
import { IUser } from "../interfaces/user";
import { SubscriptionType, UserRole } from "../interfaces/enum";
import Agency from "../models/agency";
import User from "../models/user";
const restrictedFields = ["password", "email", "role"];
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  // if(req.body.role === "SUPERADMIN" || req.body.role === UserRole.ADMIN){
  // throw createHttpError(400, {
  //     message: "Permission denied!"
  // });
  // }
  // const token = req.headers['authorization']?.split(' ')[1];
  // if(req.body.role === UserRole.ADMIN){
  //     if(!token){
  //         throw createHttpError(403, {
  //         message: "Permission denied!"
  //     })}
  //     const decodedUser = decodeToken(token);
  //     const user = await User.findById(decodedUser._id);
  //     if( !user || user.role !== "SUPERADMIN"){
  //         throw createHttpError(403, {
  //             message: "Permission denied!"
  //         });
  //     }
  //     req.body.createdBy = user._id;
  // }

  // if (req.body.role === UserRole.VENDOR) {
  //     req.body.agency = null;
  // }
  req.body.isApproved = true;
  const user = await userService.createUser(req.body);
  const {
    user: userData,
    accessToken,
    refreshToken,
  } = await createUserTokens(user);
  const cookieConfig = {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    // sameSite: 'lax', // Protection against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/", // Cookie is available for all paths
  };
  // res.cookie("auth_token", accessToken, cookieConfig);

  res.send(
    createResponse({ user: userData, accessToken, refreshToken })
  );
};
export const createMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  // if(req.body.role === "SUPERADMIN"){
  // throw createHttpError(400, {
  //     message: "Permission denied!"
  // });
  // }
  const currentUser = req.user;
  if (!currentUser) {
    throw createHttpError(403, {
      message: "Permission denied!",
    });
  }
  if (currentUser?.role === UserRole.SUPERADMIN) {
    req.body.role = UserRole.ADMIN;
  } else {
    req.body.role = UserRole.VENDOR;
    const agency = await Agency.findById(currentUser.agency).lean();
    if (!agency)
      throw createHttpError(400, { message: "Your reference Id is incorrect" });
    // if(agency.subscriptionType === SubscriptionType.FREE) throw createHttpError(400, { message: "Please upgrade your account" });
    const vendorLimit = Number(process.env.VENDOR_MEMBER_LIMIT || 3);
    if (agency.activeUsers >= vendorLimit)
      throw createHttpError(400, { message: "Your Limit is reached" });
    await Agency.findByIdAndUpdate(
      req.body.agency,
      { $inc: { activeUsers: 1 } },
      { new: true }
    );

    req.body.role = agency._id;
  }
  req.body.createdBy = currentUser._id;
  req.body.isApproved = false;

  console.log("create");
  const user = await userService.createAndInviteUser(req.body);

  res.send(createResponse(user));
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.params.token;
  const user = await decodeToken(token);
  if (!user) {
    throw createHttpError(403, {
      message: "Token is invalid",
    });
  }
  console.log("user decoded---", user);
  const password = req.body.password;
  const newUser = await User.findById(user._id);
  if (!newUser) {
    throw createHttpError(404, {
      message: "User not found",
    });
  }
  if (newUser.isApproved) {
    throw createHttpError(403, {
      message: "User is already registered",
    });
  }
  newUser.password = password;
  newUser.isApproved = true;
  await newUser.save();
  const updatedUser = await User.findById(newUser._id).lean();
  console.log("New updatedUser ---", updatedUser);
  const tokens = createUserTokens(updatedUser!);
  res.send(
    createResponse({
      ...tokens,
      user: updatedUser,
    })
  );
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const user = await userService.getUserById(req.params.id);
  if (!user) {
    throw createHttpError(404, {
      message: "User not found",
    });
  }
  res.json({ success: true, data: user });
};

export const getMyProfile = async (req: Request, res: Response) => {
  console.log("req");
  // const user = await User.findById(req.user?._id).select("-password");
  // res.send(createResponse(user, "User details feteched successfully!"));
  const user: IUser | null = await userService.getUserById(req.user?._id!);
  console.log("user", user)
  if (!user) {
    throw createHttpError(404, {
      message: "User profile not found",
    });
  }
  res.send(createResponse(user));
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  let user: any = req.user;
  console.log("user--->", user);
  if (user.isDeleted) {
    throw createHttpError(404, {
      message: "User account is deactivated",
    });
  }
  if (user && user.role === UserRole.VENDOR) {
    user = await User.findById(req.user?._id).populate("agency");
    const { password, ...userWithoutPassword } = user.toObject();
    user = userWithoutPassword;
  }
  const cookieConfig = {
    httpOnly: true, // Prevents client-side access to the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    // sameSite: 'lax', // Protection against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: "/", // Cookie is available for all paths
  };
  const {
    user: userData,
    accessToken,
    refreshToken,
  } = await createUserTokens(user);

  // res.cookie("auth_token", accessToken, cookieConfig);
  res.send(createResponse({ user: userData, accessToken, refreshToken }));
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const updateData = { ...req.body };
  // Remove restricted fields from the update data
  restrictedFields.forEach((field) => {
    if (updateData.hasOwnProperty(field)) {
      delete updateData[field];
    }
  });
  const user = await userService.updateUser(req.params.id, req.body);
  if (!user) {
    throw createHttpError(404, {
      message: "User not found",
    });
  }
  res.send(createResponse(user));
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (
    (user.role === UserRole.VENDOR &&
      req.user?.role !== UserRole.ADMIN &&
      req.user?.role !== UserRole.SUPERADMIN) ||
    user.role === UserRole.SUPERADMIN ||
    (user.role === UserRole.ADMIN && req.user?.role !== UserRole.SUPERADMIN)
  ) {
    throw createHttpError(403, {
      message: "Permission denied!",
    });
  }
  const deletedUser = await userService.deleteUser(req.params.id);
  res.send(
    createResponse({
      deletedUser,
    })
  );
};

export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("Welcome to hit the getAllUsers API");
  const { page = 1, limit = 10, role, isDeleted = false } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);

  const filter: any = {};
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    filter.role = role;
  }
  filter.isDeleted = isDeleted;

  const skip = (pageNumber - 1) * pageLimit;
  // console.log(filter,"<====filter")
  if (req.user?.role === UserRole.VENDOR) {
    filter.role = UserRole.VENDOR;
  } else {
    filter.role = [UserRole.ADMIN, UserRole.SUPERADMIN];
  }
  const users = await User.find(filter)
    .populate("agency")
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 });
  // console.log(users)
  const totalCount = await User.countDocuments(filter);
  res.send(
    createResponse({
      data: users,
      page: pageNumber,
      limit: pageLimit,
      totalPages: Math.ceil(totalCount / pageLimit),
      totalCount,
    })
  );
};
