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

  static async getNearCines(request: Request, response: Response) {
    let { size } = paginationSchema.parse(request.query)

    const cineQuerySchema = z.object({
      latitude: z.string().optional().default(''),
      longitude: z.string().optional().default(''),
    })

    const cineParams = cineQuerySchema.parse(request.query)

    latitude = Number(cineParams.latitude)
    longitude = Number(cineParams.longitude)

    const totalCount = await prisma.cine.count()
    const cines = await prisma.cine.findMany({
      include: {
        city: {
          include: {
            regions: true
          }
        }
      }
    })

    // order cines from nearest to farthest
    cines.sort((a, b) => a.distance - b.distance)

    latitude = 0;
    longitude = 0;

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: cines.filter((item, index) => index < parseInt(size)),
      pagination: {
        totalCount,
        currentPage: 1,
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
      latitude: z.number(),
      longitude: z.number(),
      cityId: z.number()
    })

    const { name, logo, latitude, longitude, cityId } = createCineSchema.parse(request.body)

    const cine = await prisma.cine.create({
      data: {
        name,
        logo,
        latitude,
        longitude,
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

    await prisma.cine.delete({
      where: {
        id: Number(id)
      }
    })

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
        movie: {
          include: {
            cast: true,
            genres: true
          }
        }
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