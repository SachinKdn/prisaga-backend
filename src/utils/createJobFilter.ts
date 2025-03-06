import moment from "moment";
import { Department, JobLevel, JobType } from "../interfaces/enum";

export function createJobFilter(query: any): any {
    const { isActive , jobType, jobLevel, department, skills, salaryFrom, experienceFrom, postedDateWithin, referenceId, search, isDeleted = false } = query;
    const filter: any = {};
    filter.isDeleted = isDeleted;
    
    if (isActive) {
        filter.isActive = isActive === 'true';
    }
    if (jobType && Object.values(JobType).includes(jobType as JobType)) {
        filter.jobType = jobType;
    }
    if (jobLevel && Object.values(JobLevel).includes(jobLevel as JobLevel)) {
        filter.jobLevel = jobLevel;
    }
    if (department) {
        // Ensure department is a valid enum and can handle both string and array input
        const departments = Array.isArray(department) ? department : [department];

        // Validate the departments against the enum values
        const validDepartments = departments.filter(dep => Object.values(Department).includes(dep as Department));

        if (validDepartments.length > 0) {
            filter.department = { $in: validDepartments }; // Match any of the valid departments
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
            { experienceFrom: { $lte: experienceFromNum } },
            { experienceTo: { $gte: experienceFromNum } }  
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
          ]
    }
    return filter;
  }
  