import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";
import { getDistanceFromLatLonInKm } from "../utils/getDistanceFromLatLonInKm";

let latitude = 0;
let longitude = 0;

const prisma = new PrismaClient().$extends({
  result: {
    cine: {
      distance: {
        needs: { latitude: true, longitude: true },
        compute: (cine: any) => {
          if (latitude === 0 && longitude === 0) return 0

          return getDistanceFromLatLonInKm(latitude, longitude, cine.latitude, cine.longitude)
        }
      }
    }
  }
})

export class MovieController {
  static async getMovies(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)

    const movieQuerySchema = z.object({
      genre: z.string().optional().default(''),
      castId: z.string().optional().default(''),
    })

    const { genre, castId } = movieQuerySchema.parse(request.query)

    const totalCount = await prisma.movie.count()
    const movies = await prisma.movie.findMany({
      include: {
        genres: true,
        cast: true,
        sessions: true
      },
      ...all !== 'true' && {
        skip: (parseInt(page) - 1) * parseInt(size),
        take: parseInt(size),
      },
      where: {
        genres: {
          some: {
            name: {
              contains: genre
            }
          }
        },
        ...castId !== '' && {
          cast: {
            some: {
              id: {
                equals: Number(castId)
              }
            }
          }
        }
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: movies,
      pagination: {
        totalCount,
        currentPage: parseInt(page),
        pageSize: parseInt(size)
      }
    })
  }

  static async getMovie(request: Request, response: Response) {
    const getMovieParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getMovieParamsSchema.parse(request.params)

    const movie = await prisma.movie.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        genres: true,
        cast: true,
        sessions: true
      }
    })

    if (!movie) throw new Error("Movie not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: movie
    })
  }

  static async createMovie(request: Request, response: Response) {
    const createMovieSchema = z.object({
      name: z.string(),
      synopsis: z.string(),
      trailer: z.string(),
      cover: z.string(),
      duration: z.string(),
      genres: z.array(z.object({
        id: z.number()
      })),
      sessions: z.array(z.object({
        id: z.number()
      })),
      cast: z.array(z.object({
        id: z.number()
      }))
    })

    const { name, synopsis, trailer, cover, duration, genres, sessions, cast } = createMovieSchema.parse(request.body)

    const movie = await prisma.movie.create({
      data: {
        name,
        synopsis,
        trailer,
        cover,
        duration,
        genres: {
          connect: genres
        },
        sessions: {
          connect: sessions
        },
        cast: {
          connect: cast
        }
      },
      include: {
        genres: true,
        sessions: true,
        cast: true
      }
    })

    return response.json({
      success: true,
      message: 'Movie created!',
      data: movie
    })
  }

  static async deleteMovie(request: Request, response: Response) {
    const deleteMovieParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteMovieParamsSchema.parse(request.params)

    const movie = await prisma.movie.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!movie) throw new Error("Movie not found");

    await prisma.movie.delete({
      where: {
        id: Number(id)
      }
    })

    return response.json({
      success: true,
      message: 'Movie deleted!',
      data: movie
    })
  }

  static async getMovieSessions(request: Request, response: Response) {
    const getMovieSessionsParamsSchema = z.object({
      id: z.string()
    })

    const cineQuerySchema = z.object({
      latitude: z.string().optional().default(''),
      longitude: z.string().optional().default(''),
    })

    const { id } = getMovieSessionsParamsSchema.parse(request.params)
    const cineParams = cineQuerySchema.parse(request.query)

    latitude = Number(cineParams.latitude)
    longitude = Number(cineParams.longitude)

    const sessions = await prisma.session.findMany({
      where: {
        movieId: Number(id),
        AND: {
          startDate: {
            gte: new Date()
          }
        }
      },
      include: {
        cine: {
          include: {
            city: true
          }
        },
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    // order cines from nearest to farthest
    sessions.sort((a, b) => a.cine.distance - b.cine.distance)

    latitude = 0;
    longitude = 0;

    return response.json({
      success: true,
      message: 'Success',
      data: sessions
    })
  }
}