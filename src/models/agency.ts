import mongoose, { Schema } from "mongoose";
import { IAgency } from "../interfaces/agency";
import { locationSchema } from "./user";
import { AreaOfExpertises, ExperienceLevel, SubscriptionType } from "../interfaces/enum";



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
    areaOfExpertise: { type: [String], enum: Object.values(AreaOfExpertises), required: false },
    targetJobLevel: { type: [String], enum: Object.values(ExperienceLevel), required: false },
    isChargeToCandidate: { type: Boolean, default: false },
    linkedin: { type: String, required: false },

    allocatedJobIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Job',
        default: []
    },
    deallocatedJobIds: {
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
    maxUserCounts: { type: Number, required: false, default: 1 },
    totalRequest: { type: Number, required: false, default: 0 },
    spentRequest: { type: Number, required: false, default: 0 },
    subscriptionExpirationDate: {type: Number, required: false}
}, { timestamps: true });


const Agency = mongoose.model<IAgency>("Agency", AgencySchema);
export default Agency;