import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { UserRole } from '../interfaces/enum';

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * @param allowedRoles - Array of roles that are allowed to access the resource
 */
export const checkRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // Passport JWT adds the user object to the request

    if (!user) {
      return next(createHttpError(401, { message: 'User is unauthorized' }));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(createHttpError(403, { message: 'Permission denied!' }));
    }
    console.log("next()")
    // If the user has the correct role, proceed to the next middleware/route handler
    next();
  };
};
