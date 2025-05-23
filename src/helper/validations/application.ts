import { check } from "express-validator";
import User from "../../models/user";
import Application from "../../models/application";
import Resume from "../../models/resume";
import PrisagaApplication from "../../models/prisagaApplication";

export const checkCandidate = [
  check("firstName")
    .exists()
    .withMessage("First Name is required")
    .bail()
    .notEmpty()
    .withMessage("First Name must not be empty"),
    check("email")
    .exists()
    .withMessage("Email is required")
    .notEmpty()
    .bail()  // Stop checking further if email is empty
    .withMessage("Email must not be empty")
    .isEmail()
    .bail()  // Stop checking further if it's not a valid email
    .withMessage("Enter a valid email"),
    // .custom(async (value: string) => {
    //   const application = await Application.findOne({ email: value });
    //   if (application) {
    //     throw new Error("Email already registered");
    //   }
    //   return true;
    // }),
    check("phoneNumber")
    .exists()
    .withMessage("Mobile number is required")
    .bail()  // Stop checking further if phoneNumber is empty
    .notEmpty()
    .withMessage("Mobile number must not be empty")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 digits")
    // .custom(async (value: string) => {
    //     const application = await Application.findOne({ phoneNumber: value });
    //     if (application) {
    //       throw new Error("Phone number already registered");
    //     }
    //     return true;
    //   }),
]
export const createApplication = [
    check("firstName")
    .exists()
    .withMessage("First Name is required")
    .bail()
    .notEmpty()
    .withMessage("First Name must not be empty"),
    check("email")
    .exists()
    .withMessage("Email is required")
    .notEmpty()
    .bail()  // Stop checking further if email is empty
    .withMessage("Email must not be empty")
    .isEmail()
    .bail()  // Stop checking further if it's not a valid email
    .withMessage("Enter a valid email"),
    check("phoneNumber")
    .exists()
    .withMessage("Mobile number is required")
    .bail()  // Stop checking further if phoneNumber is empty
    .notEmpty()
    .withMessage("Mobile number must not be empty")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 digits"),
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
    .withMessage("Area Of Expertise is required")
    .bail()
    .notEmpty()
    .withMessage("Area Of Expertise must not be empty"),
    check("job")
    .exists()
    .withMessage("Job ID is required")
    .bail()
    .notEmpty()
    .withMessage("Job ID must not be empty"),
    check("resume")
    .exists()
    .withMessage("Resume ID is required")
    .bail()
    .notEmpty()
    .withMessage("Resume ID must not be empty")
    .custom(async (value: string) =>{
      const resume = await Resume.findById(value);
      if (!resume) {
        throw new Error("Please check your resume isn't uploaded properly.");
      }
      return true;
    }),
]


export const createResume = [
  check("firstName")
  .exists()
  .withMessage("First Name is required")
  .bail()
  .notEmpty()
  .withMessage("First Name must not be empty"),
  check("email")
  .exists()
  .withMessage("Email is required")
  .notEmpty()
  .bail()  // Stop checking further if email is empty
  .withMessage("Email must not be empty")
  .isEmail()
  .bail()  // Stop checking further if it's not a valid email
  .withMessage("Enter a valid email")
  .custom(async (value: string) => {
    const application = await PrisagaApplication.findOne({ email: value });
    if (application) {
      throw new Error("Email already registered");
    }
    return true;
  }),
  check("phoneNumber")
  .exists()
  .withMessage("Mobile number is required")
  .bail()  // Stop checking further if phoneNumber is empty
  .notEmpty()
  .withMessage("Mobile number must not be empty")
  .isLength({ min: 10, max: 10 })
  .withMessage("Phone number must be between 10 digits")
  .custom(async (value: string) => {
    const application = await PrisagaApplication.findOne({ phoneNumber: value });
    if (application) {
      throw new Error("Phone number already registered");
    }
    return true;
  }),
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
  .withMessage("Area Of Expertise is required")
  .bail()
  .notEmpty()
  .withMessage("Area Of Expertise must not be empty"),
  check("experience")
  .exists()
  .withMessage("Experience is required")
  .bail()
  .notEmpty()
  .withMessage("Experience must not be empty"),
  check("resume")
  .exists()
  .withMessage("Resume ID is required")
  .bail()
  .notEmpty()
  .withMessage("Resume ID must not be empty")
  .custom(async (value: string) =>{
    const resume = await Resume.findById(value);
    if (!resume) {
      throw new Error("Please check your resume isn't uploaded properly.");
    }
    return true;
  }),
]