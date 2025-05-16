import mongoose, { Mongoose, ObjectId, Types } from "mongoose";
import { IAgency } from "../interfaces/agency";
import Agency from "../models/agency";
import createHttpError from "http-errors";
import Job from "../models/job";
import User from "../models/user";
import { IUser } from "../interfaces/user";
import { JobCategory, SubscriptionType } from "../interfaces/enum";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createAgencyFilter } from "../utils/createAgencyFilter";
import { sendEmail, vendorPlanUpgradeNotificationTemplate } from "../utils/sendMail";

export const createAgency = async (data: IAgency) => {
    const agency = await Agency.create(data);
    console.log("\n\n\n created agency -> ", agency);
    return agency;
}
export const getAgencies = async (query: any  ) => {
    const { page = 1, limit = 10 } = query;
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * pageLimit;

    const filter = createAgencyFilter(query);
    const agencies = await Agency.find(filter).skip(skip).limit(pageLimit).sort({createdAt: -1});
    console.log("\n\n\n list of agencies -> ", agencies);
    const totalCount = await Agency.countDocuments(filter);
    return { 
        data: agencies,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount
 };
}

export const getAgencyById = async (id: string): Promise<IAgency | null> => {
    const agency = await Agency.findById(id).populate('createdBy');
    if (!agency) {
        return null;  // If no agency found, return null
    }
    // The createdAt field should be available directly from the agency object.
    console.log('Agency Created At:', agency.createdAt);
    console.log('Agency Created By:', agency.createdBy);
    return agency
};

export const getAllMembersOfAgency = async (id: string): Promise<IUser[] | null> => {
    return await User.find({agency: id});
};

export const toggleJobCategory = async (agencyId: Types.ObjectId, jobId: string, category: JobCategory) => {
    const agency = await Agency.findById(agencyId);
    const jobObjectId = new mongoose.Types.ObjectId(jobId);
    if(!agency){
        throw createHttpError(404, {
            message: "Agency not found"
        });
    }
    // Remove jobId from all category arrays first
    // agency.allocatedJobIds = agency.allocatedJobIds.filter(id => !id.equals(jobObjectId));
    // agency.deallocatedJobIds = agency.deallocatedJobIds.filter(id => !id.equals(jobObjectId)); 
    // agency.engagedJobIds = agency.engagedJobIds.filter(id => !id.equals(jobObjectId));

    // Add to the specified category array
    if (category === JobCategory.ALLOCATED) {
        agency.allocatedJobIds.push(jobObjectId);
    } else if (category === JobCategory.DEALLOCATED) {
        agency.deallocatedJobIds.push(jobObjectId);
    } else if (category === JobCategory.ENGAGED) {
        agency.engagedJobIds.push(jobObjectId);
    }
    // Save the updated user document
    return await agency.save();
}

export const moveJobId = async (agencyId: Types.ObjectId, jobId: string) => {
    const agency = await Agency.findById(agencyId);
    const jobObjectId = new mongoose.Types.ObjectId(jobId);
    console.log("\n\n\n recieved jobObjectId -> ", jobObjectId);
    console.log("\n\n\n recieved agency -> ", agency);
    if(!agency){
        throw createHttpError(404, {
            message: "Agency not found"
        });
    }
    if (!agency.allocatedJobIds.includes(jobObjectId)) {
        throw createHttpError(404, {
            message: "Job ID not found in allocatedJobIds"
        });
    }
    agency.allocatedJobIds = agency.allocatedJobIds.filter(id => id.toString() !== jobObjectId.toString());
    agency.engagedJobIds.push(jobObjectId);
    await Job.findByIdAndUpdate(jobObjectId, { $inc: { noOfApplications: 1 } }, { new: true });
    
    await agency.save();
    return agency;
}

export const uploadAndUpdateLogo = async (file: Express.Multer.File, agencyId: string)=>{
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
      }
    });
    // Create a unique image key
    const timestamp = Date.now();
    const originalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    const fileKey = `agencyLogos/${agencyId}/${timestamp}-${originalName}`;
    // Upload image to S3
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: `inline; filename="${file.originalname}"`,
    }

    await s3Client.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${fileKey}`;
    console.log("\n\n\n This is file which are upload--->",fileUrl);
    console.log("\n\n\n agencyId--->",agencyId);
    return await Agency.findByIdAndUpdate(agencyId, {logo: fileUrl}, { new: true });
}

export const updateAgency = async (id: string, agencyData: Partial<IAgency>): Promise<IAgency | null> => {
    const agency = await Agency.findById(id);
    if(!agency || agency.subscriptionType !== SubscriptionType.FREE){
        throw createHttpError(401, {
            message: "Permission denied!, Might be already have a plan or agency not exists."
        });
    }
    return await Agency.findByIdAndUpdate(id, agencyData, { new: true });
};


export const sendPlanUpgradeRequest = async (data: any) => {
    
      const result = await sendEmail({
          to: 'sachincse2020@gmail.com',
          subject: "Plan Upgrade Request from Vendor - Prisaga Consulting Pvt. Ltd.",
          html: vendorPlanUpgradeNotificationTemplate(data),
          });
      console.log("Email sent successfully....")
      return result;
  }