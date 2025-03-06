import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { SubscriptionType, UserRole } from '../interfaces/enum';
import Agency from '../models/agency';

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * @param allowedRoles - Array of roles that are allowed to access the resource
 */
export const checkSubscription = (allowedSubscriptionType?: SubscriptionType[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if(req.user?.role === UserRole.VENDOR){
      const agency = await Agency.findById(req.user?.agency).lean()
      console.log("request agency--", agency);
  
      if (!agency) {
        return next(createHttpError(404, { message: 'Agency is not found' }));
      }
  
      if (agency.subscriptionType === SubscriptionType.FREE) {
        return next(createHttpError(403, { message: 'Permission denied! Please upgrade your account' }));
      }
    }

    // If the user has the correct role, proceed to the next middleware/route handler
    next();
  };
};
