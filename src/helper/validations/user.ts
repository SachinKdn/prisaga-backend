import { check } from "express-validator";
import User from "../../models/user";
import { UserRole } from "../../interfaces/enum";

export const userLogin = [
  check("email")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Email is required")
    .isEmail()
    .bail()
    .withMessage("Enter valid email"),
  check("password")
    .exists({ values: "falsy" })
    .notEmpty()
    .bail()
    .withMessage("Password is required"),
];

export const password = check("password")
  .exists()
  .bail()
  .withMessage("Password is required")
  .notEmpty()
  .bail()
  .withMessage("Password is required")
  .isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .bail()
  .withMessage("Enter strong password i.e. Abc@123");
  export const registerAgency = [
    check("email")
      .exists()
      .withMessage("Email is required")
      .notEmpty()
      .bail()  
      .withMessage("Email must not be empty")
      .isEmail()
      .bail()  
      .withMessage("Enter a valid email")
      .custom(async (value: string) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already registered");
        }
        return true;
      }),
    password,
    check("phoneNumber")
      .exists()
      .withMessage("Mobile number is required")
      .bail()  
      .notEmpty()
      .withMessage("Mobile number must not be empty")
      .isLength({ min: 10, max: 10 })
      .withMessage("Phone number must be between 10 digits"),
    check("firstName")
      .exists()
      .withMessage("First Name is required")
      .bail()  
      .notEmpty()
      .withMessage("First Name must not be empty"),
    check("userBusinessType")
      .exists()
      .withMessage("User business type is required")
      .bail()
      .isString()
      .withMessage("userBusinessType must be a string value"),
  ];
export const createUser = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .notEmpty()
    .bail()  
    .withMessage("Email must not be empty")
    .isEmail()
    .bail()  
    .withMessage("Enter a valid email")
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
password,
  check("role")
    .exists()
    .withMessage("Role is required")
    .notEmpty()
    .bail()  // Stop checking further if role is empty
    .withMessage("Role must not be empty")
    .isIn(Object.values(UserRole))
    .withMessage("Role must be a valid role"),

  check("phoneNumber")
    .exists()
    .withMessage("Mobile number is required")
    .bail()  
    .notEmpty()
    .withMessage("Mobile number must not be empty")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 digits"),
  check("username")
    .exists()
    .withMessage("Username is required")
    .bail()  
    .notEmpty()
    .withMessage("Username must not be empty")
    .custom(async (value: string) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username is already used");
      }
      return true;
    }),
];
export const createMemberUser = [
  check("email")
    .exists()
    .withMessage("Email is required")
    .notEmpty()
    .bail()  
    .withMessage("Email must not be empty")
    .isEmail()
    .bail()  // Stop checking further if it's not a valid email
    .withMessage("Enter a valid email")
    .custom(async (value: string) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Email already registered");
      }
      return true;
    }),
  check("phoneNumber")
    .exists()
    .withMessage("Mobile number is required")
    .bail()  
    .notEmpty()
    .withMessage("Mobile number must not be empty")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be between 10 digits"),
  check("username")
    .exists()
    .withMessage("Username is required")
    .bail()  
    .notEmpty()
    .withMessage("Username must not be empty")
    .custom(async (value: string) => {
      const user = await User.findOne({ username: value });
      if (user) {
        throw new Error("Username is already used");
      }
      return true;
    }),
];
  

