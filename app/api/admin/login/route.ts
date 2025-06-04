import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Initialize admin user if it doesn't exist
async function initializeAdmin() {
  const adminExists = await prisma.admin.findUnique({
    where: { username: process.env.ADMIN_USERNAME },
  })

  if (!adminExists) {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD!)
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

    const result = await login(username, password)
    console.log('Login result:', result ? 'success' : 'failed')

    if (!result) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      success: true,
      admin: result
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 