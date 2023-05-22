import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class MovieController {
  static async getMovies(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)

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

    await prisma.movie.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Movie deleted!',
      data: movie
    })
  }
}