import express from 'express'
import { authenticate } from '../middlewares/user'
import { createPresentation, getPresentation, getPresentationStatus } from '../controllers/presentation';

const router = express.Router();

router.post("/",authenticate,createPresentation);
router.get("/status/:jobId", authenticate, getPresentationStatus);
router.get("/:jobId", authenticate, getPresentation);

export default router;