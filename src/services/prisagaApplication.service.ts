
import { Request, Response } from "express";
import createHttpError from "http-errors";
import * as applicationService from "./application.service";
import * as agencyService from "./agency.service";
import { createResponse } from "../helper/response";
import { JobApplicationStatus, UserRole } from "../interfaces/enum";
import Application from "../models/application";
import { createResumeFilter } from "../utils/createResumeFilter";
import { uploadFileInCloudinary } from './application.service';
import PrisagaApplication from "../models/prisagaApplication";
import { IPrisagaApplication } from "../interfaces/prisagaApplication";


export const createPrisagaApplication = async (data: IPrisagaApplication) => {
    const application = (await PrisagaApplication.create(data)).populate('resume');
    return application;
}
export const getResumes = async (filter: any, pageNumber: number, pageLimit: number) => {
    const applications = await PrisagaApplication.find(filter).lean().populate('resume')
    .skip((pageNumber - 1) * pageLimit)
    .limit(pageLimit)
    .exec();
    return applications;
}