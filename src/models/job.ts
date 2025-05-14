import mongoose, { Schema } from "mongoose";
import { IJob, IQuestionnaire, IVendorData } from "../interfaces/job";
import { AreaOfExpertises, ExperienceLevel, JobStatus, JobType } from "../interfaces/enum";
import { locationSchema } from "./user";

export const questionnaireSchema = new Schema<IQuestionnaire>({
    question: { type: String, required: true },
    answer: { type: String, required: false },
  });
export const vendorDataSchema = new Schema<IVendorData>({
    basicFeePercentage: { type: Number, required: true },
    premiumFeePercentage: { type: Number, required: true },
    basicBillingAmount: { type: Number, required: true },
    premiumBillingAmount: { type: Number, required: true },
  });

const JobSchema: Schema = new Schema<IJob>({
  referenceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    skills: { type: [String], required: true },
    jobInsights: { type: [String], required: true },
    salaryFrom: { type: Number, required: true },
    salaryTo: { type: Number, required: true },
    noOfOpenings: { type: Number, required: true },
    jobType: { type: String, enum: Object.values(JobType), required: true },
    experienceFrom: { type: Number, required: true },
    experienceTo: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: locationSchema, required: true }, 
    isActive: { type: Boolean, default: true },
    areaOfExpertise: { type: String, enum: Object.values(AreaOfExpertises), required: false },
    jobStatus: { type: String, enum: Object.values(JobStatus), required: true, default: JobStatus.ACTIVE },
    noOfApplications: { type: Number, default: 0 },
    questionnaire: [{
      type: questionnaireSchema,
      required: true
    }],
    vendorData: {
      type: vendorDataSchema,
      required: true
    },
    minQualification: { type: String, required: true }
  }, { timestamps: true });


  

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;