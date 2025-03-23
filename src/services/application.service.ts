import { IApplication } from "../interfaces/application";
import { ICompany } from "../interfaces/company";
import { JobStatus } from "../interfaces/enum";
import Application from "../models/application";
import Company from "../models/company";
import Job from "../models/job";
import createHttpError from "http-errors";



export const createApplication = async (data: IApplication) => {
    const applicaion = (await Application.create(data)).populate('resume');
    console.log("\n\n\n created applicaion -> ", applicaion);
    return applicaion;
}

export const getApplication = async (applicationId : string) => {
    const application =  await Application.findById(applicationId).populate('resume').populate('createdByAgency').populate('createdBy');
    if(!application){
        throw createHttpError(404, {
            message: "Applicaion is not found"
        });
    }
    return application;
}

export const getMyApplications = async (filter: any) => {
    const job =  await Job.findById(filter.jobId);
    if(!job){
        throw createHttpError(404, {
            message: "Job is not found"
        });
    }
    const applications = await Application.find(filter).populate('resume').populate('createdByAgency').populate('createdBy');
    return applications;
}
export const getApplications = async (jobId : string) => {
    const job =  await Job.findById(jobId);
    if(!job){
        throw createHttpError(404, {
            message: "Job is not found"
        });
    }
    const applications = await Application.find({job: jobId}).populate('resume').populate('createdByAgency').populate('createdBy');
    return applications;
}

export const updateStatus = async (id: string, data: string): Promise<IApplication | null> => {
    if(!Object.values(JobStatus).includes(data as JobStatus)){
        throw createHttpError(400, {
            message: "Job status is invalid"
        });
    }
    return await Application.findByIdAndUpdate(id, {status: data}, { new: true });
};

export const updateApplication = async (id: string, data: Partial<IApplication>): Promise<IApplication | null> => {
    return await Application.findByIdAndUpdate(id, data, { new: true });
};

export const getResumes = async (filter: any, pageNumber: number, pageLimit: number) => {
    const applications = await Application.find(filter).lean().populate('resume')
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit)
    .exec();
    return applications;
}