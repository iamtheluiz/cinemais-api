import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class CineController {
  static async getCines(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)

    const totalCount = await prisma.cine.count()
    const cines = await prisma.cine.findMany({
      include: {
        city: {
          include: {
            regions: true
          }
        }
      },
      ...all !== 'true' && {
        skip: (parseInt(page) - 1) * parseInt(size),
        take: parseInt(size),
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cines,
      pagination: {
        totalCount,
        currentPage: parseInt(page),
        pageSize: parseInt(size)
      }
    })
  }
  
  static async getCine(request: Request, response: Response) {
    const getCineParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getCineParamsSchema.parse(request.params)

    const cine = await prisma.cine.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        city: {
          include: {
            regions: true
          }
        }
      }
    })

    if (!cine) throw new Error("Cine not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cine
    })
  }

  static async createCine(request: Request, response: Response) {
    const createCineSchema = z.object({
      name: z.string(),
      logo: z.string(),
      cityId: z.number()
    })

    const { name, logo, cityId } = createCineSchema.parse(request.body)

    const cine = await prisma.cine.create({
      data: {
        name,
        logo,
        cityId
      }
    })

    return response.json({
      success: true,
      message: 'Cine created!',
      data: cine
    })
  }

  static async deleteCine(request: Request, response: Response) {
    const deleteCineParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteCineParamsSchema.parse(request.params)
    
    const cine = await prisma.cine.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!cine) throw new Error("Cine not found");

    await prisma.cine.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Cine deleted!',
      data: cine
    })
  }

  static async openMovies(request: Request, response: Response) {
    const deleteCineParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteCineParamsSchema.parse(request.params)
    
    const sessions = await prisma.session.findMany({
      include: {
        movie: true
      },
      where: {
        cineId: Number(id),
        startDate: {
          gt: new Date()
        }
      },
    })

    return response.json({
      success: true,
      message: 'Success!',
      data: sessions
    })
  }
}