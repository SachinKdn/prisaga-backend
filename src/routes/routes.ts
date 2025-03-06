import { Router } from "express";
import userRoutes from "./user";
import agencyRoutes from "./agency"
import companyRoutes from "./company"
import jobRoutes from "./job"
import applicationRoutes from "./application"

const router = Router();

// Subdomain routes
router.use("/user", userRoutes); // Handles user-related endpoints
router.use("/agency", agencyRoutes); // Handles user-related endpoints
router.use("/company", companyRoutes); // Handles user-related endpoints
router.use("/job", jobRoutes); // Handles user-related endpoints
router.use("/application", applicationRoutes); // Handles user-related endpoints

export default router;