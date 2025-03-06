import mongoose from "mongoose";
import { BaseSchema } from "../helper/response";
import { Department, JobLevel, SubscriptionType } from "./enum";
import { Location } from "./location";


export interface IAgency extends BaseSchema{
    _id: string;
    agencyName: string;
    activeUsers: number;
    location: Location;
    createdBy: mongoose.Types.ObjectId | null;
    phoneNumber: string;
    website_url: string;
    logo: string;
    description: string;
    teamSize: number;
    isBulkHiring: boolean;
    department: Department[];
    areaOfExpertise: string;
    targetJobLevel: JobLevel[];
    isChargeToCandidate: boolean;
    linkedin: string;
    
    allocatedJobIds: mongoose.Types.ObjectId[];
    engagedJobIds: mongoose.Types.ObjectId[];


    subscriptionType: SubscriptionType;
    totalRequest: number;
    spentRequest: number;
    allocatedJobs: number;

}