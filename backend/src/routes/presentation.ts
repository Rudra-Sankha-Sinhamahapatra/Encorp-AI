import express from 'express'
import { authenticate } from '../middlewares/user'
import { createPresentation, deletePresentation, getExistingPresentationStatus, getPresentation, getPresentationStatus, getUserPresentations, updatePresentation } from '../controllers/presentation';

const router = express.Router();

router.post("/",authenticate,createPresentation);
router.get("/status/:jobId", authenticate, getPresentationStatus);
router.get("/status/existing/:jobId", authenticate, getExistingPresentationStatus);
router.get("/:jobId", authenticate, getPresentation);
router.get("/user/:userId", authenticate, getUserPresentations);
router.put('/:id',authenticate, updatePresentation);
router.delete('/:id',authenticate, deletePresentation);

export default router;