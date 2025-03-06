import moment from "moment";
import { Department } from "../interfaces/enum";

export function createCompanyFilter(query: any): any {
    const {  department, search } = query;
    const filter: any = {};

    if (department) {
        // Ensure department is a valid enum and can handle both string and array input
        const departments = Array.isArray(department) ? department : [department];

        // Validate the departments against the enum values
        const validDepartments = departments.filter(dep => Object.values(Department).includes(dep as Department));

        if (validDepartments.length > 0) {
            filter.department = { $in: validDepartments }; // Match any of the valid departments
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
  