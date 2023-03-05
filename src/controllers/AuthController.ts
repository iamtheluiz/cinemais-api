import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class AuthController {
  static async login(request: Request, response: Response) {
    const loginSchema = z.object({
      email: z.string(),
      password: z.string()
    })

    const { email, password } = loginSchema.parse(request.body)

    const user = await prisma.user.findFirst({
      where: {
        email,
        password
      }
    })

    if (!user) {
      return response.json({
        success: false,
        message: 'User not found',
        data: user
      }).status(500)
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d"
    })

    return response.json({
      success: true,
      message: 'Success',
      data: {
        token
      }
    }).status(200)
  }
  
  static async logout(request: Request, response: Response) {
    return response.json({
      success: true,
      message: 'Success',
      data: {
        token: null
      }
    }).status(200)
  }
}