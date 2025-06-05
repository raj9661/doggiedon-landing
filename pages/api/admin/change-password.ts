import type { NextApiRequest, NextApiResponse } from 'next'
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

type ResponseData = {
  message?: string
  error?: string
  success?: boolean
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Ensure we always return JSON
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        error: 'Method not allowed',
        success: false 
      })
    }

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        error: 'Invalid request body',
        success: false 
      })
    }

    const { adminId, currentPassword, newPassword } = req.body

    // Log request data (safely)
    console.log('Change password request:', {
      hasAdminId: !!adminId,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      adminIdType: typeof adminId
    })

    // Validate required fields
    const missingFields = []
    if (!adminId) missingFields.push('adminId')
    if (!currentPassword) missingFields.push('currentPassword')
    if (!newPassword) missingFields.push('newPassword')

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        success: false 
      })
    }

    // Validate adminId format
    if (typeof adminId !== 'string' || !adminId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return res.status(400).json({ 
        error: 'Invalid admin ID format',
        success: false 
      })
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    }).catch(error => {
      console.error('Database error:', error)
      throw new Error('Database error while fetching admin')
    })

    if (!admin) {
      return res.status(404).json({ 
        error: "Admin not found",
        success: false 
      })
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password)
      .catch(error => {
        console.error('Password comparison error:', error)
        throw new Error('Error verifying current password')
      })

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: "Current password is incorrect",
        success: false 
      })
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
      .catch(error => {
        console.error('Password hashing error:', error)
        throw new Error('Error hashing new password')
      })

    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    }).catch(error => {
      console.error('Database update error:', error)
      throw new Error('Error updating password in database')
    })

    return res.status(200).json({ 
      message: "Password updated successfully",
      success: true 
    })

  } catch (error) {
    // Log the full error
    console.error('Unexpected error in change-password:', error)
    
    // Return a safe error response
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false 
    })
  }
} 