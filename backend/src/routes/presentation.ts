import express from 'express'
import { authenticate } from '../middlewares/user'
import { createPresentation, getExistingPresentationStatus, getPresentation, getPresentationStatus, getUserPresentations } from '../controllers/presentation';

const router = express.Router();

router.post("/",authenticate,createPresentation);
router.get("/status/:jobId", authenticate, getPresentationStatus);
router.get("/status/existing/:jobId", authenticate, getExistingPresentationStatus);
router.get("/:jobId", authenticate, getPresentation);
router.get("/user/:userId", authenticate, getUserPresentations);

export default router;