import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { NavigationItem } from '@/lib/navigation'

const prisma = new PrismaClient()

// Get navigation items
export async function GET() {
  try {
    const items = await prisma.navigationItem.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching navigation items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation items' },
      { status: 500 }
    )
  }
}

// Update navigation items
export async function PUT(request: Request) {
  try {
    const { items } = await request.json()

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request: items must be an array' },
        { status: 400 }
      )
    }

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item: NavigationItem) =>
        prisma.navigationItem.update({
          where: { id: item.id },
          data: {
            label: item.label,
            href: item.href,
            order: item.order,
            isActive: item.isActive,
          },
        })
      )
    )

    return NextResponse.json({ message: 'Navigation items updated successfully' })
  } catch (error) {
    console.error('Error updating navigation items:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation items' },
      { status: 500 }
    )
  }
} 