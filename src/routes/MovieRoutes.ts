import { Router } from "express";
import { MovieController } from "../controllers/MovieController";
import { verifyJWT } from "../middlewares/verifyJWT";
import { verifyRoles } from "../middlewares/verifyRoles";

export const MovieRoutes = Router()

MovieRoutes.get('/movie', verifyJWT, MovieController.getMovies)
MovieRoutes.get('/movie/:id', verifyJWT, MovieController.getMovie)
MovieRoutes.post('/movie', verifyJWT, verifyRoles(['Admin']), MovieController.createMovie)
MovieRoutes.delete('/movie/:id', verifyJWT, verifyRoles(['Admin']), MovieController.deleteMovie)