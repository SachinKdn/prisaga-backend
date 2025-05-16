
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