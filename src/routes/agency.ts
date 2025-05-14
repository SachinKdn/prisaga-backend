import { Router } from "express";
import {createAgency, getAgencyById, getListOfAgency, requestForUpgrade, toggleJobCategory, updateAgency, updateAgencyLogo, updateSubscriptionType} from "../controllers/agency"
import expressAsyncHandler from "express-async-handler";
import { catchError, validate } from "../middlewares/validation";
import passport from "passport";
import { checkRole } from "../middlewares/checkRole";
import { UserRole } from "../interfaces/enum";
import { checkSubscription } from "../middlewares/checkSubscription";
import { isUserToken } from "../services/passport-jwt";
import multer from "multer";

const router = Router();
const storage = multer.memoryStorage(); // Use memory storage to keep file in memory
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // Limit file size to 10MB


router.post("/create/:userId", validate("agency:create"), catchError, expressAsyncHandler(createAgency));

router.use(passport.authenticate("jwt", { session: false }), isUserToken);

router.post("/toggleJob", validate("agency:toggleJob"), checkRole([UserRole.VENDOR]), checkSubscription(), catchError, expressAsyncHandler(toggleJobCategory));
router.get(
    "/list",
  checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]),
  expressAsyncHandler(getListOfAgency)
)
router.get("/:id", checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), expressAsyncHandler(getAgencyById));
router.put("/subcription/:id", validate("agency:subscriptionSelection"), checkRole([UserRole.ADMIN, UserRole.SUPERADMIN]), checkSubscription(), catchError, expressAsyncHandler(updateSubscriptionType));

router.put(
  "/:id",
  validate("agency:create"),
  checkRole([UserRole.VENDOR]),
  catchError,
  expressAsyncHandler(updateAgency)
);
router.post(
  "/subscriptionRequest",
  validate("agency:subscriptionSelection"),
  checkRole([UserRole.VENDOR]),
  catchError,
  expressAsyncHandler(requestForUpgrade)
);
router.post(
  "/uploadLogo/:id",
  upload.single('file'),
  expressAsyncHandler(updateAgencyLogo)
);

export default router;