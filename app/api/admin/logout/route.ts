export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ 
      message: "Logged out successfully" 
    }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      error: "Failed to logout" 
    }, { status: 500 });
  }
} 