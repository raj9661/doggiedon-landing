import { NextRequest, NextResponse } from 'next/server'
import { compare, hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Remove edge runtime
// export const runtime = 'edge'

interface LoginRequest {
  username: string
  password: string
}

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

export async function POST(request: NextRequest) {
  try {
    // Initialize admin user if it doesn't exist
    await initializeAdmin()

    const body = await request.json() as LoginRequest
    const { username, password } = body

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