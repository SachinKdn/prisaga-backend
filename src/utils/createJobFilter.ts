import moment from "moment";
import { AreaOfExpertises, ExperienceLevel, JobType } from "../interfaces/enum";

export function createJobFilter(query: any): any {
    const { isActive , jobType, areaOfExpertise, skills, salaryFrom, experienceFrom, postedDateWithin, referenceId, search, isDeleted = false } = query;
    const filter: any = {};
    filter.isDeleted = isDeleted;
    
    if (isActive) {
        filter.isActive = isActive === 'true';
    }
    if (jobType && Object.values(JobType).includes(jobType as JobType)) {
        filter.jobType = jobType;
    }
    if (areaOfExpertise) {
        // Ensure areaOfExpertise is a valid enum and can handle both string and array input
        const areaOfExpertisesArray = Array.isArray(areaOfExpertise) ? areaOfExpertise : [areaOfExpertise];

        // Validate the areaOfExpertisesArray against the enum values
        const validArea = areaOfExpertisesArray.filter(area => Object.values(AreaOfExpertises).includes(area as AreaOfExpertises));

        if (validArea.length > 0) {
            filter.areaOfExpertise = { $in: validArea }; // Match any of the valid areaOfExpertise
        }
    }
    if (skills) {
        const skillsArray = Array.isArray(skills) ? skills : [skills];
        const skillFilters = skillsArray.map(skill => ({
            skills: { $elemMatch: { $regex: new RegExp(skill as string, 'i') } } // Case-insensitive regex matching
        }));
        filter.$or = skillFilters;
    }
    if (salaryFrom) {
        const salaryFromNum = parseFloat(salaryFrom as string);
            filter.$or = [
                { salaryFrom: { $gte: salaryFromNum } },
                { salaryTo: { $gte: salaryFromNum } }  
            ];
    }
    if (experienceFrom) {
        const experienceFromNum = parseFloat(experienceFrom as string);
        filter.$and = [
            { experienceFrom: { $gte: experienceFromNum } },
            // { experienceTo: { $gte: experienceFromNum } }  
        ];
    }
    if (postedDateWithin) {
        const daysAgo = parseInt(postedDateWithin as string);
        const startDate = moment().subtract(daysAgo, 'days').toDate(); // Calculate the start date

        // Add the condition to the filter (jobs created after startDate)
        filter.createdAt = { $gte: startDate };
    }
    if(referenceId){
        filter.referenceId = referenceId;
    }
    if(search){
        const searchRegex = new RegExp(search as string, "i");
        filter.$or = [
            { referenceId: { $regex: searchRegex } },
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
          ]
    }
    return filter;
  }
  