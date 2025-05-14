import { Router } from "express";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate, validateIdParam } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { createApplication, uploadFile, getUploadedApplicationsByJobId, updateApplicationStatus, updateApplication, getUploadedApplicationById, getMyUploadedApplicationById, createResume, getAllResumesUploadedByAdmins, getApplication } from "../controllers/application";
import multer from "multer";
import { checkSubscription } from "../middlewares/checkSubscription";
import { isUserToken } from "../services/passport-jwt";

const router = Router();
const storage = multer.memoryStorage(); // Use memory storage to keep file in memory
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB


router.use(passport.authenticate("jwt", { session: false }), isUserToken)

router.post("/checkCandidate", checkRole([UserRole.VENDOR]), checkSubscription(), validate("application:checkCandidate"), catchError, expressAsyncHandler(getApplication));

router.post('/upload', checkRole([UserRole.VENDOR, UserRole.SUPERADMIN, UserRole.ADMIN]), checkSubscription(), upload.single('file'), expressAsyncHandler(uploadFile));
router.post("/create", checkRole([UserRole.VENDOR]), checkSubscription(), validate("application:create"), catchError, expressAsyncHandler(createApplication));
router.post("/resume/create", checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), checkSubscription(), validate("resume:create"), catchError, expressAsyncHandler(createResume));
router.get("/resumes", checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), expressAsyncHandler(getAllResumesUploadedByAdmins));
router.put("/:id", validateIdParam('id'), checkRole([UserRole.VENDOR]), expressAsyncHandler(updateApplication));
router.put("/updateStatus/:id", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), catchError, expressAsyncHandler(updateApplicationStatus));
router.get("/:id", validateIdParam('id'), checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getUploadedApplicationById));
router.get("/myApplications/:id", validateIdParam('id'), checkRole([UserRole.VENDOR]), expressAsyncHandler(getMyUploadedApplicationById));
router.get("/job/:id", validateIdParam('id'), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getUploadedApplicationsByJobId));



export default router;