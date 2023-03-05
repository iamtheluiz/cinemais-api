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
      return response.status(500).json({
        success: false,
        message: 'User not found',
        data: user
      })
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d"
    })

    return response.status(200).json({
      success: true,
      message: 'Success',
      data: {
        token
      }
    })
  }
  
  static async logout(request: Request, response: Response) {
    return response.status(200).json({
      success: true,
      message: 'Success',
      data: {
        token: null
      }
    })
  }
}