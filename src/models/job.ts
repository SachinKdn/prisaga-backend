import mongoose, { Schema } from "mongoose";
import { IJob, IQuestionnaire, IVendorData } from "../interfaces/job";
import { Department, JobLevel, JobType } from "../interfaces/enum";
import { locationSchema } from "./user";

export const questionnaireSchema = new Schema<IQuestionnaire>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
  });
export const vendorDataSchema = new Schema<IVendorData>({
    premiumFee: { type: String, required: true },
    premiumProFee: { type: String, required: true },
    amount: { type: String, required: true },
  });

const JobSchema: Schema = new Schema<IJob>({
  referenceId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true }, // Assuming description is a string, change to `number` if needed
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    skills: { type: [String], required: true },
    salaryFrom: { type: Number, required: true },
    salaryTo: { type: Number, required: true },
    noOfOpenings: { type: Number, required: true },
    jobType: { type: String, enum: Object.values(JobType), required: true },
    jobLevel: { type: String, enum: Object.values(JobLevel), required: true },
    experienceFrom: { type: Number, required: true },
    experienceTo: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String, required: true },
    noticePeriod: { type: String, required: true },
    location: { type: locationSchema, required: true }, 
    isActive: { type: Boolean, default: true },
    department: { type: String, enum: Object.values(Department), required: false },
    noOfApplications: { type: Number, default: 0 },
    questionnaire: [{
      type: questionnaireSchema,
      required: true
    }],
    vendorData: {
      type: vendorDataSchema,
      required: true
    }
  }, { timestamps: true });


  

const Job = mongoose.model<IJob>("Job", JobSchema);
export default Job;