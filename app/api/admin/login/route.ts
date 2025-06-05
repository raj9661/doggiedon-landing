export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Ensure request has a body
    if (!request.body) {
      return NextResponse.json(
        { error: "Request body is required" },
        { status: 400 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
      where: { username }
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      admin: {
        id: admin.id,
        username: admin.username
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    
    // Ensure we always return a properly formatted error response
    return NextResponse.json({
      error: "An unexpected error occurred during login",
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
} 