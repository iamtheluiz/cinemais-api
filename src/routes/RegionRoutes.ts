import { Router } from "express";
import { RegionController } from "../controllers/RegionController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const RegionRoutes = Router()

RegionRoutes.get('/region', verifyJWT, RegionController.getRegions)
RegionRoutes.post('/region', verifyJWT, verifyRoles(['Admin']), RegionController.createRegion)
RegionRoutes.put('/region/:id', verifyJWT, verifyRoles(['Admin']), RegionController.updateRegion)
RegionRoutes.delete('/region/:id', verifyJWT, verifyRoles(['Admin']), RegionController.deleteRegion)
// RegionRoutes.get('/region/:id', verifyJWT, CityController.getCity)
// RegionRoutes.post('/region', verifyJWT, verifyRoles(['Admin']), CityController.createCity)
// RegionRoutes.delete('/region/:id', verifyJWT, verifyRoles(['Admin']), CityController.deleteCity)