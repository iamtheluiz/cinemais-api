import { Router } from "express";
import { CityController } from "../controllers/CityController";

export const CityRoutes = Router()

CityRoutes.get('/city', CityController.getCities)
CityRoutes.get('/city/:id', CityController.getCity)
CityRoutes.post('/city', CityController.createCity)
CityRoutes.delete('/city/:id', CityController.deleteCity)