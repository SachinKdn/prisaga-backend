import { check } from "express-validator";
import Job from "../../models/job";


export const createAgency = [
    check("agencyName")
    .exists()
    .withMessage("Agency Name is required")
    .bail()
    .notEmpty()
    .withMessage("Agency Name must not be empty"),
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
    check("phoneNumber")
    .exists()
    .withMessage("Phone number is required")
    .bail()
    .isString()
    .withMessage("Phone number must be a string")
    .notEmpty()
    .withMessage("Phone number must not be empty")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 digits"),
    check("website_url")
    .optional()
    .isURL()
    .withMessage("Website URL must be a vaid"),
    check("teamSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("If provided, Team size must be a positive integer"),
    check("description")
    .optional()
    .isString()
    .withMessage("If provided, Description must be a string")
    .notEmpty()
    .withMessage("If provided, Description must not be empty"),
    check("teamSize")
    .optional()
    .isInt({ min: 1 })
    .withMessage("If provided, Team size must be a positive integer"),
    check("isBulkHiring")
    .exists()
    .withMessage("Bulk Hiring status is required")
    .bail()
    .isBoolean()
    .withMessage("Bulk Hiring must be a boolean value"),
    check("department")
    .exists()
    .withMessage("Department is required")
    .bail()
    .isArray()
    .withMessage("Department must be an array of job levels")
    .bail()
    .notEmpty()
    .withMessage("Department array must not be empty"),
    check("targetJobLevel")
    .exists()
    .withMessage("Target Job Level is required")
    .bail()
    .isArray()
    .withMessage("Target Job Level must be an array of job levels")
    .bail()
    .notEmpty()
    .withMessage("Target Job Level array must not be empty"),
    check("isChargeToCandidate")
    .exists()
    .withMessage("Charge to Candidate status is required")
    .bail()
    .isBoolean()
    .withMessage("Charge to Candidate must be a boolean value"),
    check("linkedin")
    .exists()
    .withMessage("LinkedIn URL is required")
    .bail()
    .isURL()
    .withMessage("LinkedIn URL must be a valid URL")

]

export const toggleAllocateJobId = [
    check("jobId")
    .exists()
    .withMessage("Job Id is required")
    .bail()
    .notEmpty()
    .withMessage("Job Id must not be empty")
    .custom(async (value: string) => {
        const job = await Job.findById(value);
        if (!job) {
          throw new Error("Job Id is incorrect");
        }
        return true;
      })
]