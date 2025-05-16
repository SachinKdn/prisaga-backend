import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { createCompany, getCompanies, getCompanyById } from "../controllers/company";
import { isUserToken } from "../services/passport-jwt";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }), isUserToken)

router.post("/create", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), validate("company:create"), catchError, expressAsyncHandler(createCompany));

router.get("/all", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getCompanies));

router.get("/:id", checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getCompanyById));


export default router;