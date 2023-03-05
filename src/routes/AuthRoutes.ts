import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export const AuthRoutes = Router()

AuthRoutes.post('/auth/login', AuthController.login)
AuthRoutes.post('/auth/logout', AuthController.logout)
// AuthRoutes.get('/auth/:id', CineController.getCine)
// AuthRoutes.post('/auth', CineController.createCine)