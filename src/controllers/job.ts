import { Request, Response } from "express";
import * as jobService from "../services/job.service";
import { createResponse } from "../helper/response";
import Job from "../models/job";
import { generateReferenceId } from "../utils/generateRefernceId";
import createHttpError from "http-errors";
import { createJobFilter } from "../utils/createJobFilter";

export const createJob = async (req: Request, res: Response) : Promise<void> => {
    const referenceId = generateReferenceId();
    req.body =  {...req.body, createdBy: req.user?._id, referenceId}
    const job = await jobService.createJob(req.body);
    res.send(
        createResponse({
            job,
        })
        );
}
export const updateJob = async (req: Request, res: Response): Promise<void> => {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) {
        throw createHttpError(404, {
            message: "Job not found"
        });
    }
    res.send(
        createResponse({
          job
        })
        );
  
  };
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    const job = await jobService.deleteJob(req.params.id);
    if (!job) {
        res.status(404).json({ error: "Job not found" });
        return;
    }
    res.send(
        createResponse({
            job,
        })
        );
};

export const getJobs = async (req: Request, res: Response) : Promise<void> => {
    const { page = 1, limit = 5, ...query } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);

    const filter = createJobFilter(query);
    
    console.log(filter, "<===filter getJobs")

    const jobs = await jobService.getAllJobs(filter, pageNumber, pageLimit);
    const totalCount = await Job.countDocuments(filter);

    res.send(
    createResponse({ 
        data: jobs,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount
     })
        );
   }

   
export const getJobByReferenceId = async (req: Request, res: Response) : Promise<void> => {
    const id = req.params.referenceId;
    console.log(id);
    const job = await jobService.getJobByReferenceId(id);
    res.send(
        createResponse(job)
            );
    
}

export const getEngagedJobs = async (req: Request, res: Response) : Promise<void> => {
    const { page = 1, limit = 10, isActive , ...query } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);

    const filter = createJobFilter(query);
    console.log(filter, "<===filter")
    if(!req.user?.agency){
        throw createHttpError(400, {
            message: "Permission denied! You are not under any agency."
        });
    }
    const jobs = await jobService.getEngagedJobs(filter,pageNumber, pageLimit, req.user?.agency);
    const totalCount = jobs?.length || 0;

    res.send(
    createResponse({ 
        data: jobs,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount
     })
        );    
}
export const getAllocatedJobs = async (req: Request, res: Response) : Promise<void> => {
    const { page = 1, limit = 10, isActive , ...query } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);

    const filter = createJobFilter(query);
    console.log(filter, "<===filter getAllocatedJobs")
    if(!req.user?.agency){
        throw createHttpError(400, {
            message: "Permission denied! You are not under any agency."
        });
    }
    const jobs = await jobService.getAllocatedJobs(filter,pageNumber, pageLimit, req.user?.agency);
    const totalCount = jobs?.length || 0;

    res.send(
    createResponse({ 
        data: jobs,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount
     })
        );    
}