import { Router } from "express";
import { UserController } from "../controllers/UserController";

export const UserRoutes = Router()

UserRoutes.get('/user', UserController.getUsers)
UserRoutes.get('/user/:id', UserController.getUser)
UserRoutes.post('/user', UserController.createUser)
UserRoutes.put('/user/:id', UserController.updateUser)
UserRoutes.delete('/user/:id', UserController.deleteUser)