import { PrismaClient } from '@prisma/client'
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password
      }
    })

    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d"
    })

    return token
  }
}