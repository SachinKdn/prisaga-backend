
import { AreaOfExpertises } from "../interfaces/enum";

export function createCompanyFilter(query: any): any {
    const {  areaOfExpertise, search } = query;
    const filter: any = {};

    if (areaOfExpertise) {
        // Ensure AreaOfExpertises is a valid enum and can handle both string and array input
        const areaOfExpertisesArray = Array.isArray(areaOfExpertise) ? areaOfExpertise : [areaOfExpertise];

        // Validate the AreaOfExpertises against the enum values
        const validAreaOfExpertises = areaOfExpertisesArray.filter(area => Object.values(AreaOfExpertises).includes(area as AreaOfExpertises));

        if (validAreaOfExpertises.length > 0) {
            filter.areaOfExpertise = { $in: validAreaOfExpertises }; // Match any of the valid AreaOfExpertises
        }
    }
    if(search){
        const searchRegex = new RegExp(search as string, "i");
        filter.$or = [
            { name: { $regex: searchRegex } },
          ]
    }
    return filter;
  }
  