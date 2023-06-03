import { Router } from "express";
import { SessionController } from "../controllers/SessionController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const SessionRoutes = Router()

SessionRoutes.get('/cine/:id/sessions', verifyJWT, SessionController.getSessions)
SessionRoutes.get('/session/:id', verifyJWT, SessionController.getSession)
SessionRoutes.post('/session', verifyJWT, verifyRoles(['Admin']), SessionController.createSession)
SessionRoutes.delete('/session/:id', verifyJWT, verifyRoles(['Admin']), SessionController.deleteSession)