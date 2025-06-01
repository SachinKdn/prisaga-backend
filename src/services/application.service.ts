import { IApplication } from "../interfaces/application";
import { JobApplicationStatus } from "../interfaces/enum";
import Application from "../models/application";
import cloudinary from 'cloudinary';
import Job from "../models/job";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

import createHttpError from "http-errors";
import Resume from "../models/resume";
import mongoose from "mongoose";


export const getApplication = async (email: string, phoneNumber: string, jobId: string) => {
    const filter = {
        $or: [
            { email: email },
            { phoneNumber: phoneNumber }
        ]
    };
    const applications = await Application.find(filter).populate('resume').populate('createdByAgency').populate('createdBy');
    if (applications.length === 0) {
        return {
          applications: [],
          isAlreadyApplied: false
        };
      }
    
    const jobObjectId = new mongoose.Types.ObjectId(jobId);
    const alreadyApplied = applications.some(app => app.job?.toString() === jobObjectId.toString());

    if (alreadyApplied) {
        return {
        applications: [],
        isAlreadyApplied: true
        };
    }
    return {
        applications,
        isAlreadyApplied: false
      };
}

export const createApplication = async (data: IApplication) => {
    const application = (await Application.create(data)).populate('resume');
    return application;
}

export const getApplicationById = async (applicationId : string) => {
    const application =  await Application.findById(applicationId).populate('resume').populate('createdByAgency').populate('createdBy').populate({ 
        path: 'job',
        populate: [{
          path: 'company',
          model: 'Company'
        },{
            path: 'createdBy',
            model: 'User'
          } ]
     });
    if(!application){
        throw createHttpError(404, {
            message: "Application is not found"
        });
    }
    return application;
}

export const getMyApplications = async (filter: any, skip: number, pageLimit: number, pageNumber: number) => {
    const applications = await Application.find(filter)
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 }).populate('resume').populate('createdBy');
    const totalCount = await Application.countDocuments(filter);
    return {
        data: applications,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount,
      };
}
export const getApplications = async (referenceId : string, skip: number, pageLimit: number, pageNumber: number) => {
    const job =  await Job.findOne({referenceId});
    if(!job){
        throw createHttpError(404, {
            message: "Job is not found"
        });
    }
    const applications = await Application.find({job: job._id})
    .skip(skip)
    .limit(pageLimit)
    .sort({ createdAt: -1 }).populate('resume').populate('createdByAgency').populate('createdBy');
    console.log('applications------- -- --- -- ', applications)
    const totalCount = await Application.countDocuments({job: job._id});
    return ({
        data: applications,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount,
      });
}

export const updateStatus = async (id: string, data: string): Promise<IApplication | null> => {
    if(!Object.values(JobApplicationStatus).includes(data as JobApplicationStatus)){
        throw createHttpError(400, {
            message: "Job status is invalid"
        });
    }
    return await Application.findByIdAndUpdate(id, {status: data}, { new: true });
};

export const updateApplication = async (id: string, data: Partial<IApplication>): Promise<IApplication | null> => {
    return await Application.findByIdAndUpdate(id, data, { new: true });
};


export const uploadFileInS3 = async (file: Express.Multer.File)=>{
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
      }
    });
    // Create a unique file key
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const fileKey = `resumes/${timestamp}-${originalName}`;
    // Upload file to S3
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${file.originalname}"`,
    }

    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileKey}`;
      
    const newResume = {
        fileName: file?.originalname,
        fileUrl: fileUrl,
        publicId: fileKey
    }
    return await Resume.create(newResume);
}

export const uploadFileInCloudinary = async (file: Express.Multer.File)=>{
    const options = {
        port: process.env.PORT,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
        api_key: process.env.CLOUDINARY_API_KEY,    
        api_secret: process.env.CLOUDINARY_API_SECRET 
      }
      
    cloudinary.v2.config(options);
    let resume = {};
    const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'raw', access_mode: 'public', public_id: `prisaga/${file.originalname.replace(/\s+/g, '_')}_${Date.now()}` }, // `resource_type: raw` for non-image files like PDFs
        async (error, result) => {
          if (error) {
            throw createHttpError(400, {
                message: `Error uploading to Cloudinary ${error.message}`
            });
          }
          console.log(result)
          const newResume = {
            fileName: file?.originalname,
            fileUrl: result?.secure_url,
            publicId: result?.public_id
          }
        resume = await Resume.create(newResume)
        }
      );
    stream.end(file.buffer);
    return resume;
}