import { NextRequest, NextResponse } from 'next/server'
import { NavigationItem } from '@/lib/navigation'
import { prisma } from '@/lib/prisma'

// Remove edge runtime
// export const runtime = 'edge'

// Get navigation items
export async function GET() {
  try {
    const items = await prisma.navigationItem.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching navigation items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation items' },
      { status: 500 }
    )
  }
}

// Update navigation items
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { error: 'Items must be an array' },
        { status: 400 }
      )
    }

    // Update all items in a transaction
    await prisma.$transaction(
      body.map((item: NavigationItem) =>
        prisma.navigationItem.update({
          where: { id: item.id },
          data: {
            label: item.label,
            href: item.href,
            order: item.order,
            isExternal: item.isExternal
          }
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