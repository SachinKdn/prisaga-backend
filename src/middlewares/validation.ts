import { type Response, type Request, type NextFunction } from "express";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { createMemberUser, createUser, password, registerAgency, userLogin } from "../helper/validations/user";
import { createAgency, subscriptionSelection, toggleJobCategoryId } from "../helper/validations/agency";
import { createCompany } from "../helper/validations/company";
import { createJob } from "../helper/validations/job";
import { checkCandidate, createApplication, createResume } from "../helper/validations/application";
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
    case "users:agency-register": {
      return registerAgency;
    }
    case "users:createMember": {
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
    case "agency:update": {
      return createAgency;
    }
    case "agency:subscriptionSelection": {
      return subscriptionSelection;
    }
    case "agency:toggleJob": {
      return toggleJobCategoryId;
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
    case "application:checkCandidate": {
      return checkCandidate;
    }
    case "resume:create": {
      return createResume;
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
