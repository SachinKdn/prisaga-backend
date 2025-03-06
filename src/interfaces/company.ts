import { BaseSchema } from "../helper/response";
import { Department, JobLevel, SubscriptionType } from "./enum";
import { Location } from "./location";


export interface ICompany extends BaseSchema{
    _id: string;
    name: string;
    location: Location;
    logo: string;
    teamSize: number;
    linkedin: string;
    website_url: string;
    createdBy: string;
}