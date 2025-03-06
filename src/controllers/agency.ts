import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as agencyService from "../services/agency.service";
import { createResponse } from "../helper/response";
import User from "../models/user";

export const createAgency = async (req: Request, res: Response) : Promise<void> => {

 req.body =  {...req.body, createdBy: req.user?._id}
 const agency = await agencyService.createAgency(req.body);
 await User.findByIdAndUpdate(
    req.user?._id,                   
    { agency: agency._id } 
  );
 res.send(
    createResponse({
        agency,
    })
    );
}

export const toggleAllocateJobId = async (req: Request, res: Response) : Promise<void> => {
    const {jobId} = req.body;
    if(!req.user?.agency){
        throw createHttpError(400, {
            message: "Permission denied! You are not under any agency."
        });
    }
    const agency = await agencyService.toggleJobId(req.user?.agency, jobId );
    res.send(
       createResponse({
           agency,
       })
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
        createResponse({agency,members})
      );
}