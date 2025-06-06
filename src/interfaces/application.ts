import { BaseSchema } from "../helper/response";
import { JobApplicationStatus } from "./enum";
import { Location } from "./location";
import mongoose from "mongoose";
import { Salary } from "./salary";
import { IQuestionnaire } from "./job";



export interface IApplication extends BaseSchema{
    _id: string;
    firstName: string;
    lastName: string;
    summary: string;
    areaOfExpertise: string;
    email: string;
    phoneNumber: string;
    location: Location;
    createdBy: mongoose.Types.ObjectId;
    isCreatedByAdmin: boolean;
    createdByAgency: mongoose.Types.ObjectId;
    image: string;
    linkedin: string;
    website: string;
    dob: Date;
    gender: string;
    qualifications: string;
    currentSalary: Salary;
    expectedSalary: Salary;
    noticePeriod: string;
    isFresher: boolean;
    isActive: boolean;
    experiences: IExperience[];
    diversityParameters: string[];
    diversityComments: string;
    questionnaire: IQuestionnaire[];
    job: mongoose.Types.ObjectId;
    resume: mongoose.Types.ObjectId;
    status: JobApplicationStatus;
    skills: string[];
    experience: string;
}

export interface IExperience {
    employer: string;
    jobProfile: string;
    location: Location;
    jobPeriod: string;
}