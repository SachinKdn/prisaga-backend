import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as applicationService from "../services/application.service";
import * as agencyService from "../services/agency.service";
import { createResponse } from "../helper/response";
import User from "../models/user";
import { JobStatus, UserRole } from "../interfaces/enum";
import Agency from "../models/agency";
import fs from 'fs';
import cloudinary from 'cloudinary';
import Resume from "../models/resume";
import Application from "../models/application";


export const createApplication = async (req: Request, res: Response) : Promise<void> => {
if(req.user?.role === UserRole.VENDOR && !req.user?.agency){
    throw createHttpError(400, {
        message: "Permission denied! You are not under any agency."
    });
}
if(req.user?.agency){
  await agencyService.moveJobId(req.user.agency, req.body.job)
  req.body =  {...req.body, createdBy: req.user?._id, createdByAgency: req.user.agency}
}else{
  req.body =  {...req.body, createdBy: req.user?._id, createdByAgency: null, isCreatedByAdmin: true}
}
const application = await applicationService.createApplication(req.body);
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
  if(application.status !== JobStatus.PENDING){
    throw createHttpError(401, {
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

export const uploadFiles = async (req: Request, res: Response) : Promise<void>=> {
    const options = {
        port: process.env.PORT,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your Cloud name
        api_key: process.env.CLOUDINARY_API_KEY,      // Replace with your API key
        api_secret: process.env.CLOUDINARY_API_SECRET  // Replace with your API secret
      }
    const file = req.file as Express.Multer.File;
    if (!file) {
        throw createHttpError(400, {
            message: "No file uploaded."
        });
    }
    console.log(options)
    cloudinary.v2.config(options);
    const stream = cloudinary.v2.uploader.upload_stream(
        { resource_type: 'raw', public_id: `prisaga/${file.originalname}` }, // `resource_type: raw` for non-image files like PDFs
        async (error, result) => {
          if (error) {
            throw createHttpError(400, {
                message: `Error uploading to Cloudinary ${error.message}`
            });
          }
          const newResume = {
            fileName: req.file?.originalname,
            fileUrl: result?.secure_url,
            publicId: result?.public_id
          }
          const resume = await Resume.create(newResume)
          res.send(
            createResponse({
                message: 'File uploaded successfully!',
                resume
              })
            );
        }
      );
    stream.end(file.buffer);
}

export const getUploadedApplicationById = async (req: Request, res: Response) : Promise<void> => {
    console.log("Welcome to getUploadedApplicationById")
    const id = req.params.id;
    const applications = await applicationService.getApplication(id);
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
    console.log("Welcome to getUploadedApplicationsByJobId")
    const id = req.params.id;
    const applications = await applicationService.getApplications(id);
     res.send(
        createResponse({
            applications,
        })
        );
}