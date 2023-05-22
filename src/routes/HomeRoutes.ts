import { Router } from "express";
import { HomeController } from "../controllers/HomeController";

export const HomeRoutes = Router()

HomeRoutes.get('/home/dashboard', HomeController.dashboard)