import { Router } from "express";
import { CineController } from "../controllers/CineController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const CineRoutes = Router()

CineRoutes.get('/cine', verifyJWT, CineController.getCines)
CineRoutes.get('/cine/:id', verifyJWT, CineController.getCine)
CineRoutes.post('/cine', verifyJWT, verifyRoles(['Admin']), CineController.createCine)
CineRoutes.delete('/cine/:id', verifyJWT, verifyRoles(['Admin']), CineController.deleteCine)