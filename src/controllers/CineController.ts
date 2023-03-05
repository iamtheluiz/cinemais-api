import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";

const prisma = new PrismaClient()

export class CineController {
  static async getCines(request: Request, response: Response) {
    const cines = await prisma.cine.findMany({
      include: {
        city: true
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cines
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
        city: true
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
}