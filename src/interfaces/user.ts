import mongoose from "mongoose";
import { BaseSchema } from "../helper/response";
import { UserRole } from "./enum";
import { Location } from "./location";

// export interface IUser {
//     name: string;
//     email: string;
//     password: string; // Always hashed in the database
//     role?: "USER" | "ADMIN"; // Optional, default could be "USER"
//     // createdAt?: Date; // Automatically managed by MongoDB
//     // updatedAt?: Date; // Automatically managed by MongoDB
// }

// export interface IUser extends User, Document {
//     _id: string;
// }




export interface IUser extends BaseSchema {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    username: string;
    image: string;
    location: Location;
    password: string;
    role: UserRole;
    linkedin: string;
    createdBy: mongoose.Types.ObjectId;
    isDeleted: boolean;
    isApproved: boolean;
    isFreelancer: boolean;
    agency: mongoose.Types.ObjectId | null;
    token: string;
    token_expiration: number;
}
