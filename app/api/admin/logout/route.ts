import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { logout } from '@/lib/auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')

    if (token) {
      await logout(token.value)
    }

    const response = NextResponse.json({ success: true })
    response.cookies.delete('admin_token')
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
} 