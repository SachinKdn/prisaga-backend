import { BaseSchema } from "../helper/response";
import { ICompany } from "./company";
import { AreaOfExpertises, ExperienceLevel, JobApplicationStatus, JobStatus, JobType } from "./enum";
import { Location } from "./location";
import { IUser } from "./user";

export interface IQuestionnaire {
    question: string;
    answer?: string;
}

export interface IVendorData {
    basicFeePercentage: number;
    premiumFeePercentage: number;
    basicBillingAmount: number;
    premiumBillingAmount: number;
}

export interface IJob extends BaseSchema{
    _id: string;
    referenceId: string;
    title: string;
    description: string;
    company: ICompany;
    skills: string[];
    jobInsights: string[];
    salaryFrom: number;
    salaryTo: number;
    noOfOpenings: number;
    jobType: JobType;
    experienceFrom:number;
    experienceTo:number;
    isDeleted: boolean;
    createdBy: IUser;
    location: Location;
    isActive: boolean;
    areaOfExpertise: AreaOfExpertises;
    noOfApplications: number;
    questionnaire: IQuestionnaire[];
    vendorData: IVendorData;
    minQualification: string;
    jobStatus: JobStatus;
}