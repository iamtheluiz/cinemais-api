import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import { paginationSchema } from "./schemas/paginationSchema";

const prisma = new PrismaClient()

export class RegionController {
  static async getRegions(request: Request, response: Response) {
    let { page, size, all } = paginationSchema.parse(request.query)
    const regionsQuerySchema = z.object({
      cities: z.enum(['true', 'false']).optional().default('false')
    })
    const { cities } = regionsQuerySchema.parse(request.query)
  
    const totalCount = await prisma.region.count()
    const regions = await prisma.region.findMany({
      include: {
        cities: cities === 'true'
      },
      orderBy: {
        id: 'asc'
      },
      ...all !== 'true' && {
        skip: (parseInt(page) - 1) * parseInt(size),
        take: parseInt(size),
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: regions,
      pagination: {
        totalCount,
        currentPage: parseInt(page),
        pageSize: parseInt(size)
      }
    })
  }

  static async createRegion(request: Request, response: Response) {
    const createUserSchema = z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number()
    })

    const { name, latitude, longitude } = createUserSchema.parse(request.body)

    const region = await prisma.region.create({
      data: {
        name,
        latitude,
        longitude
      }
    })

    return response.json({
      success: true,
      message: 'User created!',
      data: region
    })
  }

  static async updateRegion(request: Request, response: Response) {
    const updateRegionParamsSchema = z.object({
      id: z.string()
    })

    const createRegionSchema = z.object({
      name: z.string(),
      latitude: z.number(),
      longitude: z.number()
    })

    const { id } = updateRegionParamsSchema.parse(request.params)
    const { name, latitude, longitude } = createRegionSchema.parse(request.body)

    const region = await prisma.region.update({
      data: {
        name,
        latitude,
        longitude
      },
      where: {
        id: Number(id)
      }
    })

    return response.json({
      success: true,
      message: 'Region update!',
      data: region
    })
  }

  static async deleteRegion(request: Request, response: Response) {
    const deleteRegionParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteRegionParamsSchema.parse(request.params)
    
    const region = await prisma.region.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!region) throw new Error("Region not found");

    await prisma.region.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Region deleted!',
      data: region
    })
  }
}