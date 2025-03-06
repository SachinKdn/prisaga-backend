import { Request, Response } from "express";
import createHttpError from "http-errors";

import * as companyService from "../services/company.service";
import { createResponse } from "../helper/response";
import User from "../models/user";
import { UserRole } from "../interfaces/enum";
import { createCompanyFilter } from "../utils/createCompanyFilter";
import Company from "../models/company";

export const createCompany = async (req: Request, res: Response) : Promise<void> => {

 req.body =  {...req.body, createdBy: req.user?._id}
 const company = await companyService.createCompany(req.body);

 res.send(
    createResponse({
        company,
    })
    );
}


export const getCompanies = async (req: Request, res: Response) : Promise<void> => {
    const { page = 1, limit = 10, ...query } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const pageLimit = parseInt(limit as string, 10);

    const filter = createCompanyFilter(query);
    
    console.log(filter, "<===filter getCompanies")

    const companies = await companyService.getAllCompanies(filter,pageNumber, pageLimit);
    const totalCount = await Company.countDocuments(filter);

    res.send(
    createResponse({ 
        data: companies,
        page: pageNumber,
        limit: pageLimit,
        totalPages: Math.ceil(totalCount / pageLimit),
        totalCount,
     })
        );
   }