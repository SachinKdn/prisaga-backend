import { Router } from "express";
import {createAgency, getAgencyById, getListOfAgency, toggleAllocateJobId} from "../controllers/agency"
import expressAsyncHandler from "express-async-handler";
import { catchError, validate } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { checkSubscription } from "../middlewares/checkSubscription";

const router = Router();

router.post("/create", passport.authenticate("jwt", { session: false }), validate("agency:create"),checkRole([UserRole.VENDOR]), catchError, expressAsyncHandler(createAgency));
router.post("/toggleJob", passport.authenticate("jwt", { session: false }), validate("agency:toggleJob"),checkRole([UserRole.VENDOR]), checkSubscription(), catchError, expressAsyncHandler(toggleAllocateJobId));
router.get(
    "/list",
  passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]),
  expressAsyncHandler(getListOfAgency)
)
router.get("/:id", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getAgencyById));



export default router;