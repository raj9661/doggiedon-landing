import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Update all items in a transaction
    await prisma.$transaction(
      items.map((item: any) =>
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating navigation items:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation items' },
      { status: 500 }
    )
  }
} 