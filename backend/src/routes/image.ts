import express from "express";
import { imageProxy } from "../controllers/image";


const router = express.Router();

router.get("/proxy", imageProxy)

export default router;