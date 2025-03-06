import { BaseSchema } from "../helper/response";
import { Department, JobLevel, JobStatus, SubscriptionType } from "./enum";
import { Location } from "./location";
import mongoose from "mongoose";



export interface IApplication extends BaseSchema{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: Location;
    createdBy: mongoose.Types.ObjectId;
    isCreatedByAdmin: boolean;
    createdByAgency: mongoose.Types.ObjectId;
    image: string;
    linkedin: string;
    job: mongoose.Types.ObjectId;
    resume: mongoose.Types.ObjectId;
    status: JobStatus;
    skills: string[];
    experience: number;
}