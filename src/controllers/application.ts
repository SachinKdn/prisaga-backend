import { Request, Response } from "express";
import createHttpError from "http-errors";
import * as applicationService from "../services/application.service";
import * as prisagaApplicationService from "../services/prisagaApplication.service";
import * as agencyService from "../services/agency.service";
import { createResponse } from "../helper/response";
import { JobApplicationStatus, UserRole } from "../interfaces/enum";
import Application from "../models/application";
import { createResumeFilter } from "../utils/createResumeFilter";
import { uploadFileInCloudinary } from '../services/application.service';

export const getApplication = async (req: Request, res: Response): Promise<void> => {
  const result  = await applicationService.getApplication(req.body.email, req.body.phoneNumber, req.body.jobId);
  res.send(
    createResponse(result)
    );
}
export const createApplication = async (req: Request, res: Response) : Promise<void> => {
if(req.user?.role === UserRole.VENDOR && !req.user?.agency){
    throw createHttpError(400, {
        message: "Permission denied! You are not under any agency."
    });
}
if(req.user?.agency){
  // await agencyService.moveJobId(req.user.agency, req.body.job)
  req.body =  {...req.body, createdBy: req.user?._id, createdByAgency: req.user.agency}
}else{
  req.body =  {...req.body, createdBy: req.user?._id, createdByAgency: null, isCreatedByAdmin: true}
}
const application = await applicationService.createApplication(req.body);
 res.send(createResponse(application));
}

export const createResume = async (req: Request, res: Response) : Promise<void> => {

    req.body =  {...req.body, createdBy: req.user?._id}
  
  const application = await prisagaApplicationService.createPrisagaApplication(req.body);
  console.log("application-->", application)
   res.send(
      createResponse({
          application,
      })
      );
  }

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  const application = await applicationService.updateStatus(req.params.id, req.body.status);
  if (!application) {
      throw createHttpError(404, {
          message: "Application not found"
      });
  }
  res.send(
      createResponse({
        application,
      })
      );

};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  const application = await Application.findById(req.params.id);
  if (!application) {
      throw createHttpError(404, {
          message: "Application not found"
      });
  }
  if(application.status !== JobApplicationStatus.PENDING){
    throw createHttpError(403, {
      message: "You're not allowed to update the application now. Please contact with support!"
  });
  }
  const newApplication = await applicationService.updateApplication(req.params.id, req.body);
  res.send(
      createResponse({
        newApplication,
      })
      );

};

export const uploadFile = async (req: Request, res: Response) : Promise<void>=> {
  try {
    const file = req.file as Express.Multer.File;
    if (!file) {
        throw createHttpError(400, {
            message: "No file uploaded."
        });
    }
    const resume = await applicationService.uploadFileInS3(file)
    // const resume = await applicationService.uploadFileInCloudinary(file)
    res.send(
      createResponse({
          message: 'File uploaded successfully!',
          resume
      })
    );
    }catch (error) {
      // Handle errors
      console.error("Upload function error:", error);
      if (error instanceof Error) {
        res.status(500).send(
          createResponse({
            success: false,
            message: error.message || "An error occurred during file upload"
          })
        );
      } else {
        res.status(500).send(
          createResponse({
            success: false,
            message: "An unknown error occurred"
          })
        );
      }
    }
}

export const getUploadedApplicationById = async (req: Request, res: Response) : Promise<void> => {
    console.log("Welcome to getUploadedApplicationById")
    const id = req.params.id;
    const applications = await applicationService.getApplicationById(id);
     res.send(
        createResponse({
            applications,
        })
        );
}

export const getMyUploadedApplicationById = async (req: Request, res: Response) : Promise<void> => {
    console.log("Welcome to getMyUploadedApplicationById")
    const id = req.params.id;
    if(req.user?.role === UserRole.VENDOR && !req.user?.agency){
      throw createHttpError(400, {
          message: "Permission denied! You are not under any agency."
      });
    }
    let filter: any = {jobId: id};
    if(req.user?.role === UserRole.VENDOR) {
      filter = {...filter, createdByAgency: req.user.agency}
    }else{
      filter = {...filter, isCreatedByAdmin: true}
    }

    const applications = await applicationService.getMyApplications(filter);
     res.send(
        createResponse({
            applications,
        })
        );
}

export const getUploadedApplicationsByJobId = async (req: Request, res: Response) : Promise<void> => {
    const id = req.params.id;
    const applications = await applicationService.getApplications(id);
     res.send(
        createResponse({
            applications,
        })
        );
}

export const getAllResumesUploadedByAdmins = async (req: Request, res: Response) : Promise<void> => {
  const { page = 1, limit = 10, ...query } = req.query;
  console.log(req.query, "<===filter getResumes")
  const pageNumber = parseInt(page as string, 10);
  const pageLimit = parseInt(limit as string, 10);
  
  const filter = createResumeFilter(query);
    
  console.log(filter, "<===filter getResumes")
  const applications = await prisagaApplicationService.getResumes(filter,pageNumber, pageLimit);
  const totalCount = await Application.countDocuments(filter);

  res.send(createResponse({ 
    data: applications,
    page: pageNumber,
    limit: pageLimit,
    totalPages: Math.ceil(totalCount / pageLimit),
    totalCount
 }));
}