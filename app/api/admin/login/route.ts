import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Initialize admin user if it doesn't exist
async function initializeAdmin() {
  const adminExists = await prisma.admin.findUnique({
    where: { username: process.env.ADMIN_USERNAME },
  })

  if (!adminExists) {
    const hashedPassword = await hash(process.env.ADMIN_PASSWORD!, 10)
    await prisma.admin.create({
      data: {
        username: process.env.ADMIN_USERNAME!,
        password: hashedPassword,
      },
    })
    console.log('Admin user created')
  }
}

export async function POST(request: Request) {
  try {
    // Initialize admin user if it doesn't exist
    await initializeAdmin()

    const { username, password } = await request.json()
    console.log('Login attempt for username:', username)

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find admin by username
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Return admin info (excluding password)
    return NextResponse.json({
      id: admin.id,
      username: admin.username,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    )
  }
} 