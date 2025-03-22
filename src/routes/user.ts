import { Router } from "express";
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getMyProfile,
  getAllUsers,
  resetPassword,
  createMember,
} from "../controllers/user";
import {
  catchError,
  validate,
  validateIdParam,
} from "../middlewares/validation";

import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { isUserToken } from "../services/passport-jwt";

const router = Router();

router.post(
  "/login",
  validate("users:login"),
  catchError,
  passport.authenticate("login", { session: false }),
  expressAsyncHandler(loginUser)
);

// public routes
router.post(
  "/register",
  validate("users:create"),
  catchError,
  expressAsyncHandler(createUser)
);
router.post(
  "/resetPassword/:token",
  validate("users:set-new-password"),
  catchError,
  expressAsyncHandler(resetPassword)
);


router.use(passport.authenticate("jwt", { session: false }), isUserToken)
// protected routes
router.post(
  "/createUser",
  validate("users:createMember"),
  catchError,
  checkRole([UserRole.VENDOR, UserRole.SUPERADMIN]),
  expressAsyncHandler(createMember)
);
router.get(
  "/me",
  expressAsyncHandler(getMyProfile)
);
router.put(
  "/update/:id",
  expressAsyncHandler(updateUser)
);

router.delete(
  "/:id",
  validateIdParam("id"),
  catchError,
  checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]),
  expressAsyncHandler(deleteUser)
);

router.get(
  "/all",
  checkRole([UserRole.ADMIN, UserRole.VENDOR, UserRole.SUPERADMIN]),
  expressAsyncHandler(getAllUsers)
);
export default router;
