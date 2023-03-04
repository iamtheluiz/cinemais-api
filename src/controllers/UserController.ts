import { Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { z } from "zod";

const prisma = new PrismaClient()

export class UserController {
  static async getUsers(request: Request, response: Response) {
    const users = await prisma.user.findMany()

    response.json({
      success: true,
      message: 'Success',
      data: users
    }).status(200)
  }
  
  static async getUser(request: Request, response: Response) {
    const getUserParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await prisma.user.findUnique({ where: { id: Number(id) }})

    if (!user) throw new Error("User not found");

    response.json({
      success: true,
      message: 'Success',
      data: user
    }).status(200)
  }

  static async createUser(request: Request, response: Response) {
    const createUserSchema = z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
      role: z.string(),
    })

    const { email, firstName, lastName, password, role } = createUserSchema.parse(request.body)

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        role
      }
    })

    response.json({
      success: true,
      message: 'User created!',
      data: user
    })
  }

  static async updateUser(request: Request, response: Response) {
    const updateUserParamsSchema = z.object({
      id: z.string()
    })

    const updateUserSchema = z.object({
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      password: z.string(),
      role: z.string(),
    })

    const { id } = updateUserParamsSchema.parse(request.params)
    const { email, firstName, lastName, password, role } = updateUserSchema.parse(request.body)

    const user = await prisma.user.update({
      data: {
        email,
        firstName,
        lastName,
        password,
        role
      },
      where: { id: Number(id) }
    })

    response.json({
      success: true,
      message: 'User updated!',
      data: user
    })
  }

  static async deleteUser(request: Request, response: Response) {
    const deleteUserParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteUserParamsSchema.parse(request.params)
    
    const user = await prisma.user.findFirst({ where: {
      id: Number(id)
    }})

    if (!user) throw new Error("User not found");

    await prisma.user.delete({ where: {
      id: Number(id)
    }})

    response.json({
      success: true,
      message: 'User deleted!',
      data: user
    })
  }
}