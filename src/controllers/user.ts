import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import createHttpError from "http-errors";
import { createResponse } from "../helper/response";
import { createUserTokens, decodeToken } from "../services/passport-jwt";
import { IUser } from "../interfaces/user";
import { SubscriptionType, UserRole } from "../interfaces/enum";
import Agency from "../models/agency";
import User from "../models/user";
import { generateUsernameFromEmail } from "../utils/generateUsername";
import Job from "../models/job";
import Application from "../models/application";

export const registerAgencyVendor = async (
  req: Request,
  res: Response
): Promise<void> => {
  req.body = {
    ...req.body,
    isFreelancer: req.body.userBusinessType === 'Freelancer',
    agency: null,
    isApproved: false,
    username: generateUsernameFromEmail(req.body.email),
    role: UserRole.VENDOR,
  }
  const user = await userService.createAgencyMainMember(req.body);

  await userService.sendConfirmationLink(user._id, user.email);
  res.send(
    createResponse(user)
  );
};
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
  if(req.body.role === "SUPERADMIN"){
    throw createHttpError(400, {
        message: "Permission denied!"
    });
  }
  const currentUser = req.user!;
  if (currentUser?.role === UserRole.SUPERADMIN) {
    req.body.role = UserRole.ADMIN;
  } else if(currentUser?.role === UserRole.VENDOR) {
    req.body.role = UserRole.VENDOR;
    const agency = await Agency.findById(currentUser.agency).lean();
    if (!agency)
      throw createHttpError(400, { message: "Your reference Id is incorrect" });
    if(agency.subscriptionType === SubscriptionType.FREE) throw createHttpError(403, { message: "Please upgrade your account" });
    if (agency.activeUsers >= agency.maxUserCounts)
      throw createHttpError(403, { message: "Your Limit is reached" });
    await Agency.findByIdAndUpdate(
      agency._id,
      { $inc: { activeUsers: 1 } },
      { new: true }
    );

    req.body.agency = agency._id;
  }
  req.body.createdBy = currentUser._id;
  req.body.isApproved = false;

  console.log("create");
  const user = await userService.createAndInviteUser(req.body);
  

  res.send(createResponse(user));
};
export const verifyToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.params.token;
  const user = await userService.verifyToken(token);

  res.send(
    createResponse(user)
  );
}
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.params.token;
  const user = await userService.verifyTokenAndUpdate(token);
  if (!user) {
      throw createHttpError(403, {
        message: "Token is invalid",
      });
    }
  const newUser = await User.findById(user._id);
  if (!newUser) {
      throw createHttpError(403, {
        message: "User is already registered",
      });
    }
  const password = req.body.password;
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
  // const user = await User.findById(req.user?._id).select("-password");
  // res.send(createResponse(user, "User details feteched successfully!"));
  const user: IUser | null = await userService.getUserById(req.user?._id!);
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
    user = await User.findById(req.user?._id).populate({ 
      path: 'agency',
      populate: {
        path: 'createdBy',
        model: 'User'
      } 
   });
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
  
const restrictedFields = ["password", "email", "role"];
  restrictedFields.forEach((field) => {
    if (updateData.hasOwnProperty(field)) {
      delete updateData[field];
    }
  });
  const user = await userService.updateUser(req.params.id, updateData);
  if (!user) {
    throw createHttpError(404, {
      message: "User not found",
    });
  }
  res.send(createResponse(user));
};

export const updateProfilePicture = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
        throw createHttpError(400, {
            message: "No file uploaded."
        });
    }
    const user = await userService.uploadAndUpdateImage(file, req.user?._id!)
    if (!user) {
      throw createHttpError(404, {
        message: "User not found...",
      });
    }
    res.send(
      createResponse(user)
    );
  }catch (error) {
    // Handle errors
    console.error("Upload function error:", error);
    if (error instanceof Error) {
      res.status(500).send(
        createResponse({
          success: false,
          message: error.message || "An error occurred during image upload"
        })
      );
    } else {
      res.status(500).send(
        createResponse({
          success: false,
          message: "An unknown error occurred"
        })
      );
    }
  }
}

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
    req.user?.role !== UserRole.SUPERADMIN && 
    (
      req.user?.role === UserRole.ADMIN ||
      (req.user?.role === UserRole.VENDOR && user.role !== UserRole.VENDOR)
    )
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
  const { page = 1, limit = 10, role, isDeleted = false } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);

  const filter: any = {};
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    filter.role = role;
  }
  filter.isDeleted = isDeleted;
  const skip = (pageNumber - 1) * pageLimit;
  if (req.user?.role === UserRole.VENDOR) {
    filter.agency = req.user?.agency;
    filter.role = UserRole.VENDOR;
  } else {
    filter.role = [UserRole.ADMIN,UserRole.SUPERADMIN];
  }
    console.log("filere--=-=-===-=-\n\n\n\n", filter)
  const users = await User.find(filter)
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


export const getDashboardData = async (
  req: Request,
  res: Response
): Promise<void> => {
 
  const totalVendors = await User.countDocuments({role: UserRole.VENDOR});
  const totalMembers = await User.countDocuments({role: [UserRole.ADMIN, UserRole.SUPERADMIN]});
  const totalJobs = await Job.countDocuments();
  const totalApplications = await Application.countDocuments();
  const latestVendors = await Agency.find().limit(3).sort({ createdAt: -1 });

  // Get job statistics for the last 12 months
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11, 1); // Start from 11 months ago
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // End of current month

  const jobStats = await Job.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1
      }
    }
  ]);

  // Create array of last 12 months labels
  const months = [];
  const jobCounts = Array(12).fill(0);
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    months.unshift(date.toLocaleString('default', { month: 'short' }));
  }

  // Map job counts to their respective months
  jobStats.forEach(stat => {
    const statDate = new Date(stat._id.year, stat._id.month - 1, 1);
    const monthDiff = (currentDate.getFullYear() - statDate.getFullYear()) * 12 + 
                     (currentDate.getMonth() - statDate.getMonth());
    const index = 11 - monthDiff; // Reverse index to match the months array
    if (index >= 0 && index < 12) {
      jobCounts[index] = stat.count;
    }
  });

  const lineChartData = {
    months: months,
    data: jobCounts,
  };

  res.send(
    createResponse({
      totalVendors,
      totalMembers,
      totalJobs,
      totalApplications,
      latestVendors,
      lineChartData
    })
  );
};

export const getVendorHomeData = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentUser = await User.findById(req.user?._id).populate('agency').lean()
  if(!currentUser?.agency?._id){
      throw createHttpError(400, {
          message: "Permission denied! You are not under any agency."
      });
  }
  const agency = await Agency.findById(currentUser?.agency?._id).lean();
  const allocatedJobsCount = agency?.allocatedJobIds.length;
  const deallocatedJobsCount = agency?.deallocatedJobIds.length;
  const engagedJobsCount = agency?.engagedJobIds.length;
  const totalMembers = await User.countDocuments({ createdBy: req.user?._id });
  const latestJobs = await Job.find().limit(3).sort({ createdAt: -1 });


  res.send(
    createResponse({
      allocatedJobsCount,
      deallocatedJobsCount,
      engagedJobsCount,
      totalMembers,
      latestJobs,
    })
  );
};
