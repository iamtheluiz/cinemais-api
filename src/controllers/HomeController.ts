import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class HomeController {
  static async dashboard(request: Request, response: Response) {
    const userCount = await prisma.user.count();
    const movieCount = await prisma.movie.count();
    const cineCount = await prisma.cine.count();
    const castCount = await prisma.cast.count();
    const genreCount = await prisma.genre.count();
    const cityCount = await prisma.city.count();
    const regionCount = await prisma.region.count();

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: {
        userCount,
        movieCount,
        castCount,
        genreCount,
        cityCount,
        regionCount,
        cineCount
      }
    })
  }
}