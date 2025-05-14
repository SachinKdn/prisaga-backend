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
    check("jobInsights")
    .exists()
    .withMessage("Job Insights is required")
    .bail()
    .isArray()
    .withMessage("Job Insights must be an array of string")
    .bail()
    .notEmpty()
    .withMessage("Job Insights array must not be empty"),
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
    check("experienceFrom")
    .exists()
    .withMessage("ExperienceFrom is required")
    .bail()
    .isFloat()
    .withMessage("ExperienceFrom must be a number"),
    check("experienceTo")
    .exists()
    .withMessage("ExperienceTo is required")
    .bail()
    .isFloat()
    .withMessage("ExperienceTo must be a number"),
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
    check("areaOfExpertise")
    .exists()
    .withMessage("Area Of Expertises is required")
    .bail()
    .notEmpty()
    .withMessage("Area Of Expertises array must not be empty"),
    check("vendorData")
    .exists()
    .withMessage("VendorData is required")
    .bail()
    .isObject()
    .withMessage("VendorData must be an object"), 
    check("vendorData.basicFeePercentage")
    .exists()
    .withMessage("Basic Subscription Fee is required")
    .bail()
    .isNumeric()
    .withMessage("Basic Subscription Fee must be a number")
    .notEmpty()
    .withMessage("Basic Subscription Fee must not be empty"),
    check("vendorData.premiumFeePercentage")
    .exists()
    .withMessage("Premium Subscription Fee is required")
    .bail()
    .isNumeric()
    .withMessage("Premium Subscription Fee must be a number")
    .notEmpty()
    .withMessage("Premium Subscription Fee must not be empty"),
    check("vendorData.basicBillingAmount")
    .exists()
    .withMessage("Basic Billing Amount is required")
    .bail()
    .isNumeric()
    .withMessage("Basic Billing Amount must be a number"),
    check("vendorData.premiumBillingAmount")
    .exists()
    .withMessage("Premium Billing Amount is required")
    .bail()
    .isNumeric()
    .withMessage("Premium Billing Amount must be a number"),
    check("minQualification")
    .exists()
    .withMessage("Minimum Qualification is required")
    .bail()
    .isString()
    .withMessage("Minimum Qualification must be a string")
    .notEmpty()
    .withMessage("Minimum Qualification must not be empty")
]