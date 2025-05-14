import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate, validateIdParam } from "../middlewares/validation";
import passport from "passport";
import { createJob, deleteJob, getAllocatedJobs, getEngagedJobs, getJobByReferenceId, getJobs, updateJob } from "../controllers/job";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { isUserToken } from "../services/passport-jwt";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }), isUserToken)
router.post("/create", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), validate("job:create"), catchError, expressAsyncHandler(createJob));
router.get("/", checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getJobs));
router.get("/engagedJobs", checkRole([UserRole.VENDOR]), catchError, expressAsyncHandler(getEngagedJobs));
router.get("/allocatedJobs", checkRole([UserRole.VENDOR]), catchError, expressAsyncHandler(getAllocatedJobs));
router.get("/:referenceId", checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getJobByReferenceId));
router.put("/update/:id", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), catchError, expressAsyncHandler(updateJob));
router.delete("/:id", validateIdParam("id"), catchError, checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), expressAsyncHandler(deleteJob));


export default router;