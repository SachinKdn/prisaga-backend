import { BaseSchema } from "../helper/response";
import { JobApplicationStatus } from "./enum";
import { Location } from "./location";
import mongoose from "mongoose";



export interface IPrisagaApplication extends BaseSchema{
    _id: string;
    firstName: string;
    lastName: string;
    summary: string;
    areaOfExpertise: string;
    email: string;
    phoneNumber: string;
    location: Location;
    createdBy: mongoose.Types.ObjectId;
    image: string;
    linkedin: string;
    website: string;
    resume: mongoose.Types.ObjectId;
    skills: string[];
    experience: string;
}