import mongoose, { Schema, Document } from "mongoose";
import { ICompany } from "../interfaces/company";
import { locationSchema } from "./user";

export const CompanySchema = new Schema<ICompany>({
    name: { type: String, required: true },
    location: { type: locationSchema, required: true },
    logo: { type: String, required: false },
    teamSize: { type: Number, required: true },
    linkedin: { type: String, required: true },
    website_url: { type: String, required: true },
    createdBy: { type: String, required: true },
  }, { timestamps: true });

  
const Company = mongoose.model<ICompany>("Company", CompanySchema);
export default Company;