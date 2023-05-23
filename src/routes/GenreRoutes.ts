import { Router } from "express";
import { GenreController } from "../controllers/GenreController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const GenreRoutes = Router()

GenreRoutes.get('/genre', verifyJWT, GenreController.getGenres)
GenreRoutes.get('/genre/:id', verifyJWT, GenreController.getGenre)
GenreRoutes.post('/genre', verifyJWT, verifyRoles(['Admin']), GenreController.createGenre)
GenreRoutes.delete('/genre/:id', verifyJWT, verifyRoles(['Admin']), GenreController.deleteGenre)