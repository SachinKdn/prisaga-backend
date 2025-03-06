import { BaseSchema } from "../helper/response";
import { ICompany } from "./company";
import { Department, JobLevel, JobType, SubscriptionType } from "./enum";
import { Location } from "./location";

export interface IQuestionnaire {
    question: string;
    answer: string;
}

export interface IVendorData {
    premiumFee: string;
    premiumProFee: string;
    amount: string;
}

export interface IJob extends BaseSchema{
    _id: string;
    referenceId: string;
    title: string;
    description: string;
    company: ICompany;
    skills: string[];
    salaryFrom: number;
    salaryTo: number;
    noOfOpenings: number;
    jobType: JobType;
    jobLevel: JobLevel;
    experienceFrom:number;
    experienceTo:number;
    isDeleted: boolean;
    createdBy: string;
    noticePeriod: string;
    location: Location;
    isActive: boolean;
    department: Department;
    noOfApplications: number;
    questionnaire: IQuestionnaire[];
    vendorData: IVendorData;
}