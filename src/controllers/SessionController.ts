import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";

const prisma = new PrismaClient()

export class SessionController {
  static async getSessions(request: Request, response: Response) {
    const getSessionsRouteSchema = z.object({
      id: z.string()
    })  
    const getSessionsParamsSchema = z.object({
      date: z.string()
    })

    const { id } = getSessionsRouteSchema.parse(request.params)
    let { date } = getSessionsParamsSchema.parse(request.query)

    const filteredDate = new Date(date);
    const day = filteredDate.getDate();
    let month = `${filteredDate.getMonth() + 1}`;
    month = month.length < 2 ? `0${month}` : month; 
    const year = filteredDate.getFullYear();

    const sessions = await prisma.session.findMany({
      include: {
        cine: true,
        movie: true
      },
      where: {
        AND: {
          startDate: {
            gte: new Date(`${year}-${month}-${day}`),
          },
          endDate: {
            lt: new Date(`${year}-${month}-${day + 1}`),
          },
          cineId: parseInt(id)
        },
      }
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: sessions,
      pagination: {
        date: new Date(date)
      }
    })
  }
  
  static async getSession(request: Request, response: Response) {
    const getSessionParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getSessionParamsSchema.parse(request.params)

    const session = await prisma.session.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        cine: true,
        movie: true
      }
    })

    if (!session) throw new Error("Session not found");

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: session
    })
  }

  static async createSession(request: Request, response: Response) {
    const createSessionSchema = z.object({
      room: z.string(),
      startDate: z.date(),
      endDate: z.date(),
      cineId: z.number(),
      movieId: z.number()
    })

    const { room, startDate, endDate, cineId, movieId } = createSessionSchema.parse(request.body)

    const session = await prisma.session.create({
      data: {
        room,
        startDate,
        endDate,
        cineId,
        movieId
      }
    })

    return response.json({
      success: true,
      message: 'Session created!',
      data: session
    })
  }

  static async deleteSession(request: Request, response: Response) {
    const deleteSessionParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteSessionParamsSchema.parse(request.params)
    
    const session = await prisma.session.findFirst({
      where: {
        id: Number(id)
      }
    })

    if (!session) throw new Error("Session not found");

    await prisma.session.delete({ where: {
      id: Number(id)
    }})

    return response.json({
      success: true,
      message: 'Session deleted!',
      data: session
    })
  }
}