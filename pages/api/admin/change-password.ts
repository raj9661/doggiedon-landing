import type { NextApiRequest, NextApiResponse } from 'next'
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

type ResponseData = {
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { adminId, currentPassword, newPassword } = req.body

    if (!adminId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" })
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" })
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    })

    return res.status(200).json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return res.status(500).json({ error: "Failed to change password" })
  }
} 