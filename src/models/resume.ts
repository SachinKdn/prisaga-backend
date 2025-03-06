import mongoose, { Schema } from "mongoose";
import { IResume } from "../interfaces/resume";



export const ResumeSchema = new Schema<IResume>({
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: false },
    publicId: { type: String, required: false },
  }, { timestamps: true });
  
const Resume = mongoose.model<IResume>("Resume", ResumeSchema);
export default Resume;