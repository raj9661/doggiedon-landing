import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { compare, hash } from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { adminId, currentPassword, newPassword } = await request.json()

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