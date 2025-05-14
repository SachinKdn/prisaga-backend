import mongoose from "mongoose";
import { BaseSchema } from "../helper/response";
import { AreaOfExpertises, ExperienceLevel, SubscriptionType } from "./enum";
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
    areaOfExpertise: AreaOfExpertises[];
    targetJobLevel: ExperienceLevel[];
    isChargeToCandidate: boolean;
    linkedin: string;
    
    allocatedJobIds: mongoose.Types.ObjectId[];
    deallocatedJobIds: mongoose.Types.ObjectId[];
    engagedJobIds: mongoose.Types.ObjectId[];


    subscriptionType: SubscriptionType;
    subscriptionExpirationDate: number;
    totalRequest: number;
    spentRequest: number;
    maxUserCounts: number;

}