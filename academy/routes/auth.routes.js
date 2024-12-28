import express from "express";
import { registerAcademy, loginAcademy } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerAcademy);
router.post("/login", loginAcademy);

export default router;
