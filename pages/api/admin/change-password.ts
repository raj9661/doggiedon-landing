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
    console.log('Change password request body:', {
      ...req.body,
      currentPassword: req.body.currentPassword ? '***' : undefined,
      newPassword: req.body.newPassword ? '***' : undefined
    })

    const { adminId, currentPassword, newPassword } = req.body

    // Log each field separately to see which ones are missing
    console.log('Parsed fields:', {
      hasAdminId: !!adminId,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      adminIdType: typeof adminId,
      adminIdValue: adminId
    })

    if (!adminId || !currentPassword || !newPassword) {
      const missingFields = []
      if (!adminId) missingFields.push('adminId')
      if (!currentPassword) missingFields.push('currentPassword')
      if (!newPassword) missingFields.push('newPassword')
      console.log('Missing fields:', missingFields)
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` })
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      console.log('Admin not found for ID:', adminId)
      return res.status(404).json({ error: "Admin not found" })
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password)
    if (!isValidPassword) {
      console.log('Invalid current password for admin:', adminId)
      return res.status(401).json({ error: "Current password is incorrect" })
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    })

    console.log('Password updated successfully for admin:', adminId)
    return res.status(200).json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return res.status(500).json({ error: "Failed to change password" })
  }
} 