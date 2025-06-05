export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { compare, hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid JSON in request body',
        success: false 
      }, { status: 400 });
    }

    const { adminId, currentPassword, newPassword } = body;

    // Log request data (safely)
    console.log('Change password request:', {
      hasAdminId: !!adminId,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      adminIdType: typeof adminId
    });

    // Validate required fields
    const missingFields = [];
    if (!adminId) missingFields.push('adminId');
    if (!currentPassword) missingFields.push('currentPassword');
    if (!newPassword) missingFields.push('newPassword');

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}`,
        success: false 
      }, { status: 400 });
    }

    // Validate adminId format
    if (typeof adminId !== 'string' || !adminId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return NextResponse.json({ 
        error: 'Invalid admin ID format',
        success: false 
      }, { status: 400 });
    }

    // Get admin from database
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    }).catch(error => {
      console.error('Database error:', error);
      throw new Error('Database error while fetching admin');
    });

    if (!admin) {
      return NextResponse.json({ 
        error: "Admin not found",
        success: false 
      }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await compare(currentPassword, admin.password)
      .catch(error => {
        console.error('Password comparison error:', error);
        throw new Error('Error verifying current password');
      });

    if (!isValidPassword) {
      return NextResponse.json({ 
        error: "Current password is incorrect",
        success: false 
      }, { status: 401 });
    }

    // Hash and update new password
    const hashedPassword = await hash(newPassword, 10)
      .catch(error => {
        console.error('Password hashing error:', error);
        throw new Error('Error hashing new password');
      });

    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    }).catch(error => {
      console.error('Database update error:', error);
      throw new Error('Error updating password in database');
    });

    return NextResponse.json({ 
      message: "Password updated successfully",
      success: true 
    }, { status: 200 });

  } catch (error) {
    // Log the full error
    console.error('Unexpected error in change-password:', error);
    
    // Return a safe error response
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false 
    }, { status: 500 });
  }
} 