import mongoose, { Schema, Document } from "mongoose";
import { locationSchema } from "./user";
import { IPrisagaApplication } from "../interfaces/prisagaApplication";
import { AreaOfExpertises, ExperienceLevel, JobApplicationStatus } from "../interfaces/enum";



export const PrisagaApplicationSchema = new Schema<IPrisagaApplication>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    location: { type: locationSchema, required: true },
    image: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true },
    createdByAgency: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency', required: false, default: null },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume'
    },
    status: { type: String, enum: Object.values(JobApplicationStatus), required: true, default: JobApplicationStatus.PENDING },
    linkedin: { type: String, required: false },
    website: { type: String, required: false },
    experience: { type: String, enum: Object.values(ExperienceLevel), required: true },
    summary: { type: String, required: false },
    areaOfExpertise: { type: String, enum: Object.values(AreaOfExpertises), required: true },
    isCreatedByAdmin: { type: Boolean, required: false, default: false },
    skills: { type: [String], required: false },
  }, { timestamps: true });

  
const PrisagaApplication = mongoose.model<IPrisagaApplication>("PrisagaApplication", PrisagaApplicationSchema);
export default PrisagaApplication;