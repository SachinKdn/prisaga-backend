import mongoose, { Mongoose, ObjectId, Types } from "mongoose";
import { IAgency } from "../interfaces/agency";
import Agency from "../models/agency";
import createHttpError from "http-errors";
import Job from "../models/job";
import User from "../models/user";
import { IUser } from "../interfaces/user";


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

    const filter: any = {};
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

export const toggleJobId = async (agencyId: Types.ObjectId, jobId: string) => {
    const agency = await Agency.findById(agencyId);
    const jobObjectId = new mongoose.Types.ObjectId(jobId);
    if(!agency){
        throw createHttpError(404, {
            message: "Agency not found"
        });
    }
    
    const index = agency.allocatedJobIds.indexOf(jobObjectId);
    
    if (index === -1) {
      // Job ID not found, add it
      agency.allocatedJobIds.push(jobObjectId);
    } else {
      // Job ID found, remove it
      agency.allocatedJobIds.splice(index, 1);
    }

    // Save the updated user document
    await agency.save();
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
        throw createHttpError(401, {
            message: "Job ID not found in allocatedJobIds"
        });
    }
    agency.allocatedJobIds = agency.allocatedJobIds.filter(id => id.toString() !== jobObjectId.toString());
    agency.engagedJobIds.push(jobObjectId);
    await Job.findByIdAndUpdate(jobObjectId, { $inc: { noOfApplications: 1 } }, { new: true });
    
    await agency.save();
    return agency;
}


