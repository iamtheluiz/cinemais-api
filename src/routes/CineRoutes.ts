import { Router } from "express";
import { CineController } from "../controllers/CineController";

export const CineRoutes = Router()

CineRoutes.get('/cine', CineController.getCines)
CineRoutes.get('/cine/:id', CineController.getCine)
CineRoutes.post('/cine', CineController.createCine)