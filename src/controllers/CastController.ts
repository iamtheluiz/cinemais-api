import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class CastController {
  static async getCasts(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)

    const totalCount = await prisma.cast.count()
    const casts = await prisma.cast.findMany({
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
      data: casts,
      pagination: {
        totalCount,
        currentPage: parseInt(page),
        pageSize: parseInt(size)
      }
    })
  }
  
  static async getCast(request: Request, response: Response) {
    const getGenreParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getGenreParamsSchema.parse(request.params)

    const cast = await prisma.cast.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        movies: true
      }
    })

    if (!cast) throw new Error("Cast not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cast
    })
  }

  static async createCast(request: Request, response: Response) {
    const createCastSchema = z.object({
      name: z.string(),
      bio: z.string(),
      picture: z.string()
    })

    const { name, bio, picture } = createCastSchema.parse(request.body)

    const cast = await prisma.cast.create({
      data: {
        name,
        bio,
        picture
      }
    })

    return response.json({
      success: true,
      message: 'Cast created!',
      data: cast
    })
  }

  static async deleteCast(request: Request, response: Response) {
    const deleteCastParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteCastParamsSchema.parse(request.params)
    
    const cast = await prisma.cast.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!cast) throw new Error("Cast not found");

    await prisma.cast.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Cast deleted!',
      data: cast
    })
  }
}