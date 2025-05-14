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
  updateProfilePicture,
  verifyToken,
  registerAgencyVendor,
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
import multer from "multer";

const router = Router();

const storage = multer.memoryStorage(); // Use memory storage to keep file in memory
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB

router.post(
  "/login",
  validate("users:login"),
  catchError,
  passport.authenticate("login", { session: false }),
  expressAsyncHandler(loginUser)
);

// public routes
router.post(
  "/agency-register",
  validate("users:agency-register"),
  catchError,
  expressAsyncHandler(registerAgencyVendor)
);
router.post(
  "/register",
  validate("users:create"),
  catchError,
  expressAsyncHandler(createUser)
);
router.post(
  "/verifyToken/:token",
  catchError,
  expressAsyncHandler(verifyToken)
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
router.post(
  "/updateProfilePic",
  upload.single('file'),
  expressAsyncHandler(updateProfilePicture)
);
router.put(
  "/update/:id",
  expressAsyncHandler(updateUser)
);

router.delete(
  "/:id",
  validateIdParam("id"),
  catchError,
  checkRole([UserRole.VENDOR,  UserRole.SUPERADMIN]),
  expressAsyncHandler(deleteUser)
);

router.get(
  "/all",
  checkRole([UserRole.ADMIN, UserRole.VENDOR, UserRole.SUPERADMIN]),
  expressAsyncHandler(getAllUsers)
);
export default router;
