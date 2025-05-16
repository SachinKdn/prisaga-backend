import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "../interfaces/company";
import { locationSchema } from "./user";
import { IApplication } from "../interfaces/application";
import { AreaOfExpertises, ExperienceLevel, JobApplicationStatus } from "../interfaces/enum";
import { Salary } from "../interfaces/salary";
import { IQuestionnaire } from "../interfaces/job";
export const salarySchema = new Schema<Salary>({
    amount: { type: Number, required: false },
    tenure: { type: String, required: true },
    currency: { type: String, required: true },
  });
  const experienceSchema = new mongoose.Schema({
    employer: { type: String, required: true },
    jobProfile: { type: String, required: true },
    location: { type: locationSchema, required: true },
    jobPeriod: { type: String, required: true }
  }, { _id: false });
  
export const questionnaireSchema = new Schema<IQuestionnaire>({
    question: { type: String, required: true },
    answer: { type: String, required: true },
  });
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
        ref: 'Job',
        required: true
    },
    resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
        required: true
    },
    status: { type: String, enum: Object.values(JobApplicationStatus), required: true, default: JobApplicationStatus.PENDING },
    linkedin: { type: String, required: false },
    website: { type: String, required: false },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    qualifications:  { type: String, required: true },
    currentSalary: { type: salarySchema, required: false },
    expectedSalary: { type: salarySchema, required: true },
    noticePeriod: { type: String, required: false },
    isFresher: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
    experience: { type: String, enum: Object.values(ExperienceLevel), required: true },
    summary: { type: String, required: false },
    diversityParameters: { type: [String], required: false },
    diversityComments:  { type: String, required: false },
    
    areaOfExpertise: { type: String, enum: Object.values(AreaOfExpertises), required: true },
    isCreatedByAdmin: { type: Boolean, required: false, default: false },
    skills: { type: [String], required: false },
    experiences: [{type: experienceSchema, required: false}],
    questionnaire: [{
        type: questionnaireSchema,
        required: true
      }],
  }, { timestamps: true });

  
const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
export default Application;