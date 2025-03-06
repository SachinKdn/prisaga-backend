import mongoose, { Schema } from "mongoose";
import { IAgency } from "../interfaces/agency";
import { locationSchema } from "./user";
import { Department, JobLevel, SubscriptionType } from "../interfaces/enum";



const AgencySchema = new Schema<IAgency>({
    agencyName: {type: String, required: true},
    activeUsers: {type: Number, default: 1},
    location: { type: locationSchema, required: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    phoneNumber: { type: String, required: true },
    website_url: { type: String, required: false },
    logo: { type: String, required: false },
    description: { type: String, required: false },
    teamSize: { type: Number, required: false, default: 1 },
    isBulkHiring: { type: Boolean, default: false },
    department: { type: [String], enum: Object.values(Department), required: false },
    areaOfExpertise: { type: String, required: false },
    targetJobLevel: { type: [String], enum: Object.values(JobLevel), required: false },
    isChargeToCandidate: { type: Boolean, default: false },
    linkedin: { type: String, required: false },

    allocatedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Job',
        default: []
    },
    engagedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Job',
        default: []
    },


    subscriptionType: { type: String, enum: Object.values(SubscriptionType), default: SubscriptionType.FREE },
    totalRequest: { type: Number, required: false, default: 5 },
    spentRequest: { type: Number, required: false, default: 0 },
    allocatedJobs: { type: Number, required: false, default: 0 },
}, { timestamps: true });


const Agency = mongoose.model<IAgency>("Agency", AgencySchema);
export default Agency;