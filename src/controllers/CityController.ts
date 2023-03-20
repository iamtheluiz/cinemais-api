import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class CityController {
  static async getCities(request: Request, response: Response) {
    const { page, size } = paginationSchema.parse(request.query)

    const cities = await prisma.city.findMany({
      include: {
        regions: true
      },
      skip: (page - 1) * size,
      take: size
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cities
    })
  }
  
  static async getCity(request: Request, response: Response) {
    const getCityParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getCityParamsSchema.parse(request.params)

    const city = await prisma.city.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        regions: true
      }
    })

    if (!city) throw new Error("City not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: city
    })
  }

  static async createCity(request: Request, response: Response) {
    const createCitySchema = z.object({
      name: z.string(),
      regions: z.array(z.object({
        id: z.number()
      })),
      latitude: z.number(),
      longitude: z.number()
    })

    const { name, latitude, longitude, regions } = createCitySchema.parse(request.body)

    const city = await prisma.city.create({
      data: {
        name,
        latitude,
        longitude,
        regions: {
          connect: regions
        }
      },
      include: {
        regions: true
      }
    })

    return response.json({
      success: true,
      message: 'City created!',
      data: city
    })
  }

  static async deleteCity(request: Request, response: Response) {
    const deleteCityParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteCityParamsSchema.parse(request.params)
    
    const city = await prisma.city.findFirst({
      where: {
        id: Number(id)
      },
      include: {
        regions: true
      }
    })

    if (!city) throw new Error("City not found");

    await prisma.city.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'City deleted!',
      data: city
    })
  }
}