import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as agencyService from "../services/agency.service";
import { createResponse } from "../helper/response";
import User from "../models/user";
import Agency from "../models/agency";
import { SubscriptionType } from "../interfaces/enum";

export const createAgency = async (req: Request, res: Response) : Promise<void> => {
    const user = await User.findById(req.params.userId).lean()
    if(!user || user.agency ){
        throw createHttpError(401, {
            message: "Permission denied! You're not authorized"
        });
    }
 req.body =  {...req.body, createdBy: user._id}
 const agency = await agencyService.createAgency(req.body);
 await User.findByIdAndUpdate(
    user._id,                   
    { agency: agency._id , isApproved: true} 
  );
 res.send(
    createResponse(agency)
    );
}

export const toggleJobCategory = async (req: Request, res: Response) : Promise<void> => {
    const {jobId, category} = req.body;
    const currentUser = await User.findById(req.user?._id).populate('agency').lean()
    if(!currentUser?.agency?._id){
        throw createHttpError(400, {
            message: "Permission denied! You are not under any agency."
        });
    }
    const agencyData = await agencyService.toggleJobCategory(currentUser?.agency?._id, jobId, category);
    res.send(
       createResponse(agencyData)
       );
   }

   
export const getListOfAgency =async (req:Request, res: Response) : Promise<void> => {
    const agencies = await agencyService.getAgencies(req.query)
    res.send(
        createResponse(agencies)
      );
}
   
export const getAgencyById = async (req:Request, res: Response) : Promise<void> => {
    const agency = await agencyService.getAgencyById(req.params.id)
    const members = await agencyService.getAllMembersOfAgency(req.params.id)
    res.send(
        createResponse({agency, members})
      );
}
export const updateSubscriptionType = async (req:Request, res: Response) : Promise<void> => {
  
  if(req.body.subscriptionType === SubscriptionType.FREE)
    throw createHttpError(403, {
      message: "Permission denied! You can't degrade the plan"
  });
  const updateData = {
    subscriptionType : req.body.subscriptionType,
    maxUserCounts : req.body.subscriptionType === SubscriptionType.LITE ? 4 : 10,
    totalRequest : req.body.subscriptionType === SubscriptionType.LITE ? 12 : 40,
    subscriptionExpirationDate: req.body.subscriptionType === SubscriptionType.LITE ? 
      Date.now() + (5 * 365 * 24 * 60 * 60 * 1000) : // 5 years in milliseconds
      Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year in milliseconds
  }
  const agency = await agencyService.updateAgency(req.params.id, updateData);
  res.send(
      createResponse(agency)
    );
}
export const updateAgencyLogo = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const file = req.file as Express.Multer.File;
      if (!file) {
          throw createHttpError(400, {
              message: "No file uploaded."
          });
      }
      const agency = await Agency.findById(req.params.id);
      if(!agency){
        throw createHttpError(404, {
            message: "Agency not found!"
        });
      }
      const updatedAgency = await agencyService.uploadAndUpdateLogo(file, req.params.id)
      res.send(
        createResponse(updatedAgency)
      );
    }catch (error) {
      // Handle errors
      console.error("Upload function error:", error);
      if (error instanceof Error) {
        res.status(500).send(
          createResponse({
            success: false,
            message: error.message || "An error occurred during logo upload"
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

  
export const updateAgency = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const updateData = { ...req.body };
    // Remove restricted fields from the update data
    const restrictedFields = ["password", "email", "role", "activeUsers", "allocatedJobIds", "deallocatedJobIds", "engagedJobIds", "subscriptionType", "totalRequest", "spentRequest"];
    restrictedFields.forEach((field) => {
      if (updateData.hasOwnProperty(field)) {
        delete updateData[field];
      }
    });
    const agency = await agencyService.updateAgency(req.params.id, updateData);
    if (!agency) {
      throw createHttpError(404, {
        message: "Agency not found",
      });
    }
    res.send(createResponse(agency));
  };

  
export const requestForUpgrade = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const agency = await Agency.findById(req.user?.agency?._id).lean();
    
    if (!agency) {
      throw createHttpError(404, {
        message: "Agency not found",
      });
    }
    const data = {
      vendorName: req.user?.firstName + (req.user?.lastName || ''),
      currentPlan: agency.subscriptionType,
      requestedPlan: req.body.subscriptionType,
      vendorEmail: req.user?.email,
      vendorPhoneNumber: req.user?.phoneNumber,
      companyName: agency.agencyName
    }
    await agencyService.sendPlanUpgradeRequest(data);
    res.send(createResponse("Request Submitted Successfully"));
  };