import { Department, ExperienceLevel } from "../interfaces/enum";



export function createResumeFilter(query: any): any {
    const  {experience, areaOfExpertise, isCreatedByAdmin = true, search} = query;
    const filter: any = {};
    
    filter.isCreatedByAdmin = isCreatedByAdmin;
    if (experience && Object.values(ExperienceLevel).includes(experience as ExperienceLevel)) {
        filter.experience = experience;
    }
    if (areaOfExpertise && Object.values(Department).includes(areaOfExpertise as Department)) {
        filter.areaOfExpertise = areaOfExpertise;
    }
    if(search){
        const searchRegex = new RegExp(search as string, "i");
        filter.$or = [
            { referenceId: { $regex: searchRegex } },
            { summary: { $regex: searchRegex } },
          ]
    }

    
    return filter;
}