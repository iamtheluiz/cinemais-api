import { Request, Response } from "express";
import { z } from "zod";
import { AuthService } from "../services/AuthService";

export class AuthController {
  static async login(request: Request, response: Response) {
    const loginSchema = z.object({
      email: z.string().email(),
      password: z.string()
    })

    const { email, password } = loginSchema.parse(request.body)

    try {
      const token = await AuthService.login(email, password)

      return response.status(200).json({
        success: true,
        message: 'Success',
        data: {
          token
        }
      })
    } catch (error: any) {
      return response.status(500).json({
        success: false,
        message: error.message,
        data: {
          email
        }
      })
    }
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