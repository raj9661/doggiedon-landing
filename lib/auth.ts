import { PrismaClient } from '@prisma/client'
import { compare, hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Use a fixed-length key for HMAC
const JWT_SECRET = 'ffefb1710ad827d89be9bac460eb649fd198e85e6947ceb7bb4f74e31bc5267ae1f9cad864d044ffc3f51bf06166a42800515fecd5e49f6b8a7f189075ae4daa'

// Helper function to convert string to ArrayBuffer
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder()
  const uint8Array = encoder.encode(str)
  return uint8Array.slice().buffer
}

// Helper function to convert ArrayBuffer to string
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder()
  return decoder.decode(buffer)
}

// Helper function to convert ArrayBuffer to base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  return btoa(String.fromCharCode.apply(null, Array.from(bytes)))
}

// Helper function to convert base64 to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function verifyToken(token: string): Promise<{ adminId: string } | null> {
  try {
    console.log('Verifying token:', token.substring(0, 20) + '...')
    
    const [payloadBase64, signatureBase64] = token.split('.')
    if (!payloadBase64 || !signatureBase64) {
      console.log('Invalid token format - missing parts')
      return null
    }

    // Verify the signature
    const payloadData = stringToArrayBuffer(payloadBase64)
    const signature = base64ToArrayBuffer(signatureBase64)
    const keyData = stringToArrayBuffer(JWT_SECRET)

    console.log('Token parts:', {
      payloadLength: payloadBase64.length,
      signatureLength: signatureBase64.length,
      keyLength: JWT_SECRET.length
    })

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )

    console.log('Key imported successfully')

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signature,
      payloadData
    )

    console.log('Signature verification result:', isValid)

    if (!isValid) {
      console.log('Invalid signature')
      return null
    }

    // Parse and verify payload
    const payload = JSON.parse(atob(payloadBase64))
    console.log('Payload:', { ...payload, exp: new Date(payload.exp * 1000).toISOString() })

    if (payload.exp && payload.exp < Date.now() / 1000) {
      console.log('Token expired at:', new Date(payload.exp * 1000).toISOString())
      return null
    }

    return { adminId: payload.adminId }
  } catch (error) {
    console.error('Token verification failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    return null
  }
}

export async function createAdminSession(adminId: string): Promise<string> {
  try {
    console.log('Creating session for admin:', adminId)
    
    const payload = {
      adminId,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
      iat: Math.floor(Date.now() / 1000)
    }

    const payloadBase64 = btoa(JSON.stringify(payload))
    const payloadData = stringToArrayBuffer(payloadBase64)
    const keyData = stringToArrayBuffer(JWT_SECRET)

    console.log('Session creation:', {
      payloadLength: payloadBase64.length,
      keyLength: JWT_SECRET.length
    })

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    console.log('Key imported successfully')

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      payloadData
    )

    const token = `${payloadBase64}.${arrayBufferToBase64(signature)}`
    const expiresAt = new Date(payload.exp * 1000)

    console.log('Token created:', {
      tokenLength: token.length,
      expiresAt: expiresAt.toISOString()
    })

    // Delete any existing sessions for this admin
    await prisma.adminSession.deleteMany({
      where: { adminId }
    })

    // Create new session
    await prisma.adminSession.create({
      data: {
        adminId,
        token,
        expiresAt,
      },
    })

    console.log('Session created successfully')
    return token
  } catch (error) {
    console.error('Session creation failed:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
    }
    throw error
  }
}

export async function validateSession(token: string): Promise<boolean> {
  try {
    console.log('Validating session for token:', token.substring(0, 10) + '...')
    
    // First verify the JWT token
    const payload = await verifyToken(token)
    if (!payload) {
      console.log('JWT verification failed')
      return false
    }

    // Then check if the session exists in the database
    const session = await prisma.adminSession.findFirst({
      where: {
        token,
        expiresAt: { gt: new Date() },
        adminId: payload.adminId,
      },
    })

    console.log('Session found:', !!session)
    return !!session
  } catch (error) {
    console.error('Session validation error:', error)
    return false
  }
}

export async function login(username: string, password: string): Promise<{ id: string, username: string } | null> {
  try {
    const admin = await prisma.admin.findUnique({ where: { username } })
    
    if (!admin) {
      console.log('Admin not found')
      return null
    }

    const isValid = await verifyPassword(password, admin.password)
    console.log('Password verification:', isValid)
    
    if (!isValid) {
      return null
    }

    return { id: admin.id, username: admin.username }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function logout(token: string): Promise<void> {
  try {
    const payload = await verifyToken(token)
    if (payload) {
      await prisma.adminSession.deleteMany({
        where: { token }
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
}

export async function changePassword(adminId: string, currentPassword: string, newPassword: string): Promise<boolean> {
  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } })
    
    if (!admin) {
      return false
    }

    const isValid = await verifyPassword(currentPassword, admin.password)
    
    if (!isValid) {
      return false
    }

    const hashedNewPassword = await hashPassword(newPassword)
    
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedNewPassword },
    })

    return true
  } catch (error) {
    console.error('Change password error:', error)
    return false
  }
}

export async function getCurrentAdmin(adminId: string) {
  try {
    return prisma.admin.findUnique({
      where: { id: adminId },
      select: { id: true, username: true },
    })
  } catch (error) {
    console.error('Get current admin error:', error)
    return null
  }
} 