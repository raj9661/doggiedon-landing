export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { defaultNavigationItems } from "@/lib/navigation";
import type { NavigationItem } from "@/lib/navigation";

export async function GET() {
  try {
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      // Return default items if database connection fails
      const defaultItems = defaultNavigationItems.map((item: NavigationItem) => ({
        ...item,
        url: item.href,
        isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
      }));
      return NextResponse.json({ 
        items: defaultItems,
        message: 'Using default navigation items due to database connection issue'
      }, { status: 200 });
    }

    console.log('Fetching navigation items from database...');
    const items = await prisma.navigationItem.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        label: true,
        href: true,
        order: true,
        isActive: true
      }
    }).catch(queryError => {
      console.error('Database query error:', queryError);
      return null;
    });

    if (!items) {
      return NextResponse.json({ 
        items: [],
        error: 'Failed to fetch navigation items'
      }, { status: 500 });
    }

    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error('Navigation API error:', error);
    return NextResponse.json({ 
      items: [],
      error: 'Failed to fetch navigation items'
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const items = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json({ 
        error: 'Invalid request body - expected array of items'
      }, { status: 400 });
    }

    // Validate each item
    for (const item of items) {
      if (!item.id || !item.label || !item.href) {
        return NextResponse.json({ 
          error: 'Invalid item format - missing required fields'
        }, { status: 400 });
      }
    }

    // Update items in database
    await Promise.all(items.map(item =>
      prisma.navigationItem.update({
        where: { id: item.id },
        data: {
          label: item.label,
          href: item.href,
          order: item.order,
          isActive: item.isActive
        }
      })
    ));

    return NextResponse.json({ 
      message: 'Navigation items updated successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Navigation update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update navigation items'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
} 