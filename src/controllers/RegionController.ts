import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";

const prisma = new PrismaClient()

export class RegionController {
  static async getRegions(request: Request, response: Response) {
    const regionsQuerySchema = z.object({
      cities: z.enum(['true', 'false']).optional().default('false')
    })
    const { cities } = regionsQuerySchema.parse(request.query)
  
    const regions = await prisma.region.findMany({
      include: {
        cities: cities === 'true'
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: regions
    })
  }
}