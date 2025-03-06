import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { createCompany, getCompanies } from "../controllers/company";

const router = Router();

router.post("/create", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), validate("company:create"), catchError, expressAsyncHandler(createCompany));

router.get("/all", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getCompanies));



export default router;