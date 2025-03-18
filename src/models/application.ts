import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "../interfaces/company";
import { locationSchema } from "./user";
import { IApplication } from "../interfaces/application";
import { Department, JobLevel, JobStatus } from "../interfaces/enum";

export const ApplicationSchema = new Schema<IApplication>({
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
    status: { type: String, enum: Object.values(JobStatus), required: true, default: JobStatus.PENDING },
    linkedin: { type: String, required: true },
    experience: { type: String, enum: Object.values(JobLevel), required: true },
    summary: { type: String, required: false },
    areaOfExpertise: { type: String, enum: Object.values(Department), required: true },
    isCreatedByAdmin: { type: Boolean, required: false, default: false },
    skills: { type: [String], required: false },
  }, { timestamps: true });

  
const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;