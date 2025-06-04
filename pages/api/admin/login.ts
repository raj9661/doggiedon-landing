import type { NextApiRequest, NextApiResponse } from 'next'
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

type ResponseData = {
  message?: string
  error?: string
  admin?: {
    id: string
    username: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" })
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return res.status(401).json({ error: "Invalid username or password" })
    }

    const isValidPassword = await compare(password, admin.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" })
    }

    return res.status(200).json({
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username
      }
    })
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json({ error: "Failed to login" })
  }
} 