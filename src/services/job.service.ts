import { Types } from "mongoose";
import { IJob } from "../interfaces/job";
import Agency from "../models/agency";
import Job from "../models/job";
import createHttpError from "http-errors"; 


export const createJob = async (data: IJob) => {
    return await Job.create(data);
}
export const deleteJob = async (id: string): Promise<IJob | null> => {
    return await Job.findByIdAndUpdate(id, {isDeleted: true}, { new: true } );
};
export const updateJob = async (id: string, data: Partial<IJob>): Promise<IJob | null> => {
  return await Job.findByIdAndUpdate(id, data, { new: true });
};
export const getAllJobs = async (filter: any, pageNumber: number, pageLimit: number): Promise<IJob[] | null> => {
    const jobs = await Job.find(filter).lean().populate("company")
            .skip((pageNumber - 1) * pageLimit) // Skip for pagination
            .limit(pageLimit) // Limit for pagination
            .exec();
    return jobs;
};


export const getJobByReferenceId= async (referenceId: string): Promise<IJob | null> => {
    const job = await Job.findOne({referenceId}).lean().populate("company").lean();
    console.log("jobs------>-", job)
    return job;
};
export const getEngagedJobs= async (filter: any, pageNumber: number, pageLimit: number, agencyId: Types.ObjectId): Promise<Types.ObjectId[] | null> => {
    const agency = await Agency.findById(agencyId)
      .populate({
        path: 'engagedJobIds',
        match: filter,  // Apply the filter here
        options: {
          limit: pageLimit,          // Apply limit (pagination)
          skip: (pageNumber - 1) * pageLimit,  // Skip jobs for the previous pages
        },
        populate:{
          path: 'company'
        }
      })
      .exec();  // Execute the query

    if (!agency) {
        throw createHttpError(404, {
            message: "Permission denied! Agency not found"
        });
    }
    return agency.engagedJobIds;
};

export const getAllocatedJobs= async (filter: any, pageNumber: number, pageLimit: number, agencyId: Types.ObjectId): Promise<Types.ObjectId[] | null> => {
  const agency = await Agency.findById(agencyId)
    .populate({
      path: 'allocatedJobIds',
      match: filter,  // Apply the filter here
      options: {
        limit: pageLimit,          // Apply limit (pagination)
        skip: (pageNumber - 1) * pageLimit,  // Skip jobs for the previous pages
      },
      populate:{
        path: 'company'
      }
    })
    .exec();  // Execute the query

  if (!agency) {
      throw createHttpError(404, {
          message: "Permission denied! Agency not found"
      });
  }
  return agency.allocatedJobIds;
};