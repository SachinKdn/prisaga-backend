import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { createMemberUser, createUser, password, userLogin } from "../helper/validations/user";
import { createAgency, toggleAllocateJobId } from "../helper/validations/agency";
import { createCompany } from "../helper/validations/company";
import { createJob } from "../helper/validations/job";
import { createApplication } from "../helper/validations/application";
import mongoose from "mongoose";


export const validate = (validationName: string): any[] => {
  switch (validationName) {
    case "users:login": {
      return userLogin;
    }
    // case "users:update": {
    //   return userUpdate;
    // }
    case "users:create": {
      return createUser;
    }
    case "users:createMember": {
      console.log("Sahi")
      return createMemberUser;
    }
    // case "users:create-with-link": {
    //   return createUserWithLink;
    // }
    case "set-new-password":
      return [password];
    case "agency:create": {
      return createAgency;
    }
    case "agency:toggleJob": {
      return toggleAllocateJobId;
    }
    case "company:create": {
      return createCompany;
    }
    case "job:create": {
      return createJob;
    }
    case "application:create": {
      return createApplication;
    }
    default:
      return [];
  }
};

export const catchError = expressAsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    const isError = errors.isEmpty();
    console.log(isError)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isError) {
        const data = { errors: errors.array() };
        throw createHttpError(400, {
            message: "Validation error!",
            data,
        });
        // throw new AppError("Validation error!!",400, data);
    } else {
      next();
    }
  }
);

export const validateIdParam = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw createHttpError(400, {
        message: `Invalid ${paramName}`
      });
    }
    next();
  };
};
