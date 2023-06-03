import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class GenreController {
  static async getGenres(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)

    const totalCount = await prisma.genre.count()
    const genres = await prisma.genre.findMany({
      include: {
        movies: true
      },
      ...all !== 'true' && {
        skip: (parseInt(page) - 1) * parseInt(size),
        take: parseInt(size),
      },
      orderBy: {
        name: 'asc'
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: genres,
      pagination: {
        totalCount,
        currentPage: parseInt(page),
        pageSize: parseInt(size)
      }
    })
  }
  
  static async getGenre(request: Request, response: Response) {
    const getGenreParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getGenreParamsSchema.parse(request.params)

    const genre = await prisma.genre.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        movies: true
      }
    })

    if (!genre) throw new Error("Genre not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: genre
    })
  }

  static async createGenre(request: Request, response: Response) {
    const createGenreSchema = z.object({
      name: z.string()
    })

    const { name } = createGenreSchema.parse(request.body)

    const genre = await prisma.genre.create({
      data: {
        name
      }
    })

    return response.json({
      success: true,
      message: 'Genre created!',
      data: genre
    })
  }

  static async deleteGenre(request: Request, response: Response) {
    const deleteGenreParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteGenreParamsSchema.parse(request.params)
    
    const genre = await prisma.genre.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!genre) throw new Error("Genre not found");

    await prisma.genre.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Genre deleted!',
      data: genre
    })
  }
}