import { NextRequest, NextResponse } from "next/server"
import { compare, hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

// Remove edge runtime
// export const runtime = 'edge'

interface ChangePasswordRequest {
  adminId: string
  currentPassword: string
  newPassword: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ChangePasswordRequest
    const { adminId, currentPassword, newPassword } = body

    if (!adminId || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    })

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      )
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error changing password:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
} 