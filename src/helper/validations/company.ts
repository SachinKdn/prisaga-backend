import { check } from "express-validator";


export const createCompany = [
    check("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .notEmpty()
    .withMessage("Name must not be empty"),
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
    check("teamSize")
    .exists()
    .withMessage("TeamSize is required")
    .bail()
    .isInt()
    .withMessage("TeamSize must be a number")
]