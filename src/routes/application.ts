import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { catchError, validate, validateIdParam } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { createApplication, uploadFiles, getUploadedApplicationsByJobId, updateApplicationStatus, updateApplication, getUploadedApplicationById, getMyUploadedApplicationById, createResume, getAllResumesUploadedByAdmins } from "../controllers/application";
import multer from "multer";
import { checkSubscription } from "../middlewares/checkSubscription";

const router = Router();
const storage = multer.memoryStorage(); // Use memory storage to keep file in memory
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB


router.post('/upload', passport.authenticate("jwt", { session: false }), checkRole([UserRole.VENDOR, UserRole.SUPERADMIN, UserRole.ADMIN]), checkSubscription(), upload.single('file'), expressAsyncHandler(uploadFiles));


router.post("/create", passport.authenticate("jwt", { session: false }), checkRole([UserRole.VENDOR, UserRole.ADMIN]), checkSubscription(), validate("application:create"), catchError, expressAsyncHandler(createApplication));
router.post("/resume/create", passport.authenticate("jwt", { session: false }), checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), checkSubscription(), validate("resume:create"), catchError, expressAsyncHandler(createResume));
router.get("/resumes", passport.authenticate("jwt", { session: false }), checkRole([UserRole.SUPERADMIN, UserRole.ADMIN]), expressAsyncHandler(getAllResumesUploadedByAdmins));
router.put("/:id", passport.authenticate("jwt", { session: false }), validateIdParam('id'), checkRole([UserRole.VENDOR]), expressAsyncHandler(updateApplication));
router.put("/updateStatus/:id", passport.authenticate("jwt", { session: false }), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), catchError, expressAsyncHandler(updateApplicationStatus));
router.get("/:id", passport.authenticate("jwt", { session: false }), validateIdParam('id'), checkRole([UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getUploadedApplicationById));
router.get("/myApplications/:id", passport.authenticate("jwt", { session: false }), validateIdParam('id'), checkRole([UserRole.VENDOR]), expressAsyncHandler(getMyUploadedApplicationById));
router.get("/job/:id", passport.authenticate("jwt", { session: false }), validateIdParam('id'), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getUploadedApplicationsByJobId));



export default router;