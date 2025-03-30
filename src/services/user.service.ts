
 const bcrypt = require("bcryptjs")
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { UserRole } from "../interfaces/enum";
 import { IUser } from "../interfaces/user"; 
import Agency from "../models/agency";
import User from "../models/user";
import { resetPasswordEmailTemplate, sendEmail } from "../utils/sendMail";
import { createUserTokens } from "./passport-jwt";

export const getUserByEmail = async (email: string) => {
    console.log("finding user by mail")
    const user = await User.findOne({ email: email }).lean();
    return user;
  };

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
    const { accessToken } = await createUserTokens(result);
    await sendEmail({
        to: user!.email,
        subject: "Reset password at Prisaga Consulting Pvt. Ltd.",
        html: resetPasswordEmailTemplate(accessToken),
        });
    console.log("Email sent successfully....")
    return result;
};

export const getUserById = async (id: string): Promise<IUser | null> => {
    console.log(id)
    return await User.findById(id).populate('agency');
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