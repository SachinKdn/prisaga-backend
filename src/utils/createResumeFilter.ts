import { AreaOfExpertises, ExperienceLevel } from "../interfaces/enum";



export function createResumeFilter(query: any): any {
    const  {experience, areaOfExpertise, search} = query;
    const filter: any = {};
    
    if (experience && Object.values(ExperienceLevel).includes(experience as ExperienceLevel)) {
        filter.experience = experience;
    }
    if (areaOfExpertise && Object.values(AreaOfExpertises).includes(areaOfExpertise as AreaOfExpertises)) {
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