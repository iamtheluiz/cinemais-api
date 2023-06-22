import { Router } from "express";
import { CineController } from "../controllers/CineController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const CineRoutes = Router()

CineRoutes.get('/cine/near', CineController.getNearCines)
CineRoutes.get('/cine', CineController.getCines)
CineRoutes.get('/cine/:id', CineController.getCine)
CineRoutes.post('/cine', verifyJWT, verifyRoles(['Admin']), CineController.createCine)
CineRoutes.delete('/cine/:id', verifyJWT, verifyRoles(['Admin']), CineController.deleteCine)
CineRoutes.get('/cine/:id/open', CineController.openMovies)