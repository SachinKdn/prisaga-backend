import { check } from "express-validator";
import Company from "../../models/company";


export const createJob = [
    check("title")
    .exists()
    .withMessage("Title is required")
    .bail()
    .notEmpty()
    .withMessage("Title must not be empty"),
    check("description")
    .exists()
    .withMessage("Description is required")
    .bail()
    .notEmpty()
    .withMessage("Description must not be empty"),
    check("company")
    .exists()
    .withMessage("Company is required")
    .notEmpty()
    .bail()  
    .withMessage("Company must not be empty")
    .custom(async (value: string) => {
      const company = await Company.findById(value);
      if (!company) {
        throw new Error("Company id is not found");
      }
      return true;
    }),
    check("skills")
    .exists()
    .withMessage("Skills is required")
    .bail()
    .isArray()
    .withMessage("Skills must be an array of string")
    .bail()
    .notEmpty()
    .withMessage("Skills array must not be empty"),
    check("salaryFrom")
    .exists()
    .withMessage("SalaryFrom is required")
    .bail()
    .isInt()
    .withMessage("SalaryFrom must be a number"),
    check("salaryTo")
    .exists()
    .withMessage("SalaryTo is required")
    .bail()
    .isInt()
    .withMessage("SalaryTo must be a number"),
    check("noOfOpenings")
    .exists()
    .withMessage("No of openings is required")
    .bail()
    .isInt()
    .withMessage("No of openings must be a number"),
    check("jobType")
    .exists()
    .withMessage("JobType is required")
    .bail()
    .notEmpty()
    .withMessage("JobType array must not be empty"),
    check("jobLevel")
    .exists()
    .withMessage("JobLevel is required")
    .bail()
    .notEmpty()
    .withMessage("JobLevel array must not be empty"),
    check("experienceFrom")
    .exists()
    .withMessage("ExperienceFrom is required")
    .bail()
    .isInt()
    .withMessage("ExperienceFrom must be a number"),
    check("experienceTo")
    .exists()
    .withMessage("ExperienceTo is required")
    .bail()
    .isInt()
    .withMessage("ExperienceTo must be a number"),
    check("noticePeriod")
    .exists()
    .withMessage("NoticePeriod is required")
    .bail()
    .notEmpty()
    .withMessage("NoticePeriod must not be empty"),
    check("location")
    .exists()
    .withMessage("Location is required")
    .bail()
    .isObject()
    .withMessage("Location must be an object"), 
    check("location.city")
    .exists()
    .withMessage("City is required")
    .bail()
    .isString()
    .withMessage("City must be a string")
    .notEmpty()
    .withMessage("City must not be empty"),
    check("location.state")
    .exists()
    .withMessage("State is required")
    .bail()
    .isString()
    .withMessage("State must be a string")
    .notEmpty()
    .withMessage("State must not be empty"),
    check("location.postalCode")
    .exists()
    .withMessage("Postal Code is required")
    .bail()
    .isInt()
    .withMessage("Postal Code must be a number"),
    check("department")
    .exists()
    .withMessage("Department is required")
    .bail()
    .notEmpty()
    .withMessage("Department array must not be empty"),
    check("vendorData")
    .exists()
    .withMessage("VendorData is required")
    .bail()
    .isObject()
    .withMessage("Location must be an object"), 
    check("vendorData.premiumFee")
    .exists()
    .withMessage("Premium Fee is required")
    .bail()
    .isString()
    .withMessage("Premium Fee must be a string")
    .notEmpty()
    .withMessage("Premium Fee must not be empty"),
    check("vendorData.premiumProFee")
    .exists()
    .withMessage("Premium Pro Fee is required")
    .bail()
    .isString()
    .withMessage("Premium Pro Fee must be a string")
    .notEmpty()
    .withMessage("Premium Pro Fee must not be empty"),
    check("vendorData.amount")
    .exists()
    .withMessage("Amount is required")
    .bail()
    .isString()
    .withMessage("Amount must be a number"),
]