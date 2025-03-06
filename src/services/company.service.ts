import { ICompany } from "../interfaces/company";
import Company from "../models/company";



export const createCompany = async (data: ICompany) => {
    const company = await Company.create(data);
    console.log("\n\n\n created company -> ", company);
    return company;
}

export const getAllCompanies = async (filter: any, pageNumber: number, pageLimit: number): Promise<ICompany[] | null> => {
    const companies = await Company.find(filter).lean()
            .skip((pageNumber - 1) * pageLimit) // Skip for pagination
            .limit(pageLimit) // Limit for pagination
            .exec();
    return companies;
};