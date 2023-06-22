import { Router } from "express";
import { GenreController } from "../controllers/GenreController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const GenreRoutes = Router()

GenreRoutes.get('/genre', GenreController.getGenres)
GenreRoutes.get('/genre/:id', GenreController.getGenre)
GenreRoutes.post('/genre', verifyJWT, verifyRoles(['Admin']), GenreController.createGenre)
GenreRoutes.put('/genre/:id', verifyJWT, verifyRoles(['Admin']), GenreController.updateGenre)
GenreRoutes.delete('/genre/:id', verifyJWT, verifyRoles(['Admin']), GenreController.deleteGenre)