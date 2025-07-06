import express from "express";
import {
  signUp,
  login,
  logout,
  getme,
} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", login);

router.post("/logout", logout);

//protected route

router.get("/me", protectRoute, getme);

export default router;
