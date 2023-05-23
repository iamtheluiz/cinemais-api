import { Router } from "express";
import { CastController } from "../controllers/CastController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const CastRoutes = Router()

CastRoutes.get('/cast', verifyJWT, CastController.getCasts)
CastRoutes.get('/cast/:id', verifyJWT, CastController.getCast)
CastRoutes.post('/cast', verifyJWT, verifyRoles(['Admin']), CastController.createCast)
CastRoutes.delete('/cast/:id', verifyJWT, verifyRoles(['Admin']), CastController.deleteCast)