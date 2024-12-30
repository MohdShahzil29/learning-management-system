import express from "express";
import { purchaseCourse } from "../controllers/purchase.controller.js";

const router = express.Router();

router.post("/purchase", purchaseCourse);

export default router;
