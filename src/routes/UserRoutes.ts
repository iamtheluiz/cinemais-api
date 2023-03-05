import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const UserRoutes = Router()

UserRoutes.get('/user', verifyJWT, UserController.getUsers)
UserRoutes.get('/user/:id', verifyJWT, UserController.getUser)
UserRoutes.post('/user', verifyJWT, verifyRoles(['Admin']), UserController.createUser)
UserRoutes.put('/user/:id', verifyJWT, verifyRoles(['Admin']), UserController.updateUser)
UserRoutes.delete('/user/:id', verifyJWT, verifyRoles(['Admin']), UserController.deleteUser)