import { Router } from "express";
import { CityController } from "../controllers/CityController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const CityRoutes = Router()

CityRoutes.get('/city', verifyJWT, CityController.getCities)
CityRoutes.get('/city/:id', verifyJWT, CityController.getCity)
CityRoutes.post('/city', verifyJWT, verifyRoles(['Admin']), CityController.createCity)
CityRoutes.delete('/city/:id', verifyJWT, verifyRoles(['Admin']), CityController.deleteCity)