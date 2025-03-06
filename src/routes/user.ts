import { Router } from "express";
import { createUser, getUser, updateUser, deleteUser, loginUser, getMyProfile, getAllUsers, resetPassword, createMember } from "../controllers/user";
import { catchError, validate, validateIdParam } from "../middlewares/validation";

import expressAsyncHandler from "express-async-handler";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { isUserToken } from "../services/passport-jwt";



const router = Router();


router.post("/register", validate("users:create"), catchError, expressAsyncHandler(createUser));
router.post("/createUser", validate("users:createMember"), passport.authenticate("jwt", { session: false }), catchError, checkRole([UserRole.VENDOR, UserRole.SUPERADMIN]), expressAsyncHandler(createMember));
router.post("/resetPassword/:token", validate("users:set-new-password"), catchError, expressAsyncHandler(resetPassword));


router.get("/me",
passport.authenticate("jwt", { session: false }),
isUserToken,
expressAsyncHandler(getMyProfile))

router.put("/update/:id",
passport.authenticate("jwt", { session: false }),
expressAsyncHandler(updateUser));

router.delete("/:id", validateIdParam("id"),
passport.authenticate("jwt", { session: false }), catchError, checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]),
expressAsyncHandler(deleteUser));


router.post(
  "/login",
  validate("users:login"),
  catchError,
  passport.authenticate("login", { session: false }),
  expressAsyncHandler(loginUser)
  );
  
  router.get(
    "/all",
  passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.VENDOR,UserRole.SUPERADMIN]),
  expressAsyncHandler(getAllUsers)
)
export default router;
