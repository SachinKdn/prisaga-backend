import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate, validateIdParam } from "../middlewares/validation";
import passport from "passport";
import { createJob, deleteJob, getAllocatedJobs, getEngagedJobs, getJobByReferenceId, getJobs, updateJob } from "../controllers/job";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";

const router = Router();

router.post("/create", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), validate("job:create"), catchError, expressAsyncHandler(createJob));
router.get("/jobs", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getJobs));
router.get("/engagedJobs", passport.authenticate("jwt", { session: false }), checkRole([UserRole.VENDOR]), catchError, expressAsyncHandler(getEngagedJobs));
router.get("/allocatedJobs", passport.authenticate("jwt", { session: false }), checkRole([UserRole.VENDOR]), catchError, expressAsyncHandler(getAllocatedJobs));
router.get("/:referenceId", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getJobByReferenceId));
router.put("/update/:id", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), catchError, expressAsyncHandler(updateJob));
router.delete("/:id", validateIdParam("id"), passport.authenticate("jwt", { session: false }), catchError, checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), expressAsyncHandler(deleteJob));


export default router;