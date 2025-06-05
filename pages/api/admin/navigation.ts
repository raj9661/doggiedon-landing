import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/lib/prisma"
import { defaultNavigationItems, NavigationItem } from "@/lib/navigation"

type ResponseData = {
  items?: NavigationItem[]
  message?: string
  error?: string
}

// Export the handler as default
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    try {
      // Test database connection
      try {
        await prisma.$connect()
        console.log('Database connection successful')
      } catch (dbError) {
        console.error('Database connection error:', dbError)
        // Return default items if database connection fails
        const defaultItems = defaultNavigationItems.map((item: NavigationItem) => ({
          ...item,
          url: item.href,
          isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
        }))
        return res.status(200).json({ 
          items: defaultItems,
          message: 'Using default navigation items due to database connection issue'
        })
      }

      console.log('Fetching navigation items from database...')
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
        console.error('Database query error:', queryError)
        return null
      })

      if (!items) {
        console.log('Database query failed, using default items')
        const defaultItems = defaultNavigationItems.map((item: NavigationItem) => ({
          ...item,
          url: item.href,
          isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
        }))
        return res.status(200).json({ 
          items: defaultItems,
          message: 'Using default navigation items due to database query error'
        })
      }

      console.log('Found navigation items:', items)

      if (items.length === 0) {
        console.log('No navigation items found in database')
        // Return default items if none found in database
        const defaultItems = defaultNavigationItems.map((item: NavigationItem) => ({
          ...item,
          url: item.href,
          isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
        }))
        console.log('Returning default navigation items:', defaultItems)
        return res.status(200).json({ 
          items: defaultItems,
          message: 'Using default navigation items as database is empty'
        })
      }

      // Transform the data to match the expected structure
      const transformedItems = items.map((item: { 
        id: string
        label: string
        href: string
        order: number
        isActive: boolean
      }) => ({
        ...item,
        url: item.href, // Map href to url for consistency
        isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
      }))
      console.log('Transformed navigation items:', transformedItems)

      return res.status(200).json({ items: transformedItems })
    } catch (error) {
      console.error("Error in navigation API:", error)
      // Return default items on any error
      const defaultItems = defaultNavigationItems.map((item: NavigationItem) => ({
        ...item,
        url: item.href,
        isExternal: item.href.startsWith('http://') || item.href.startsWith('https://')
      }))
      return res.status(200).json({ 
        items: defaultItems,
        message: 'Using default navigation items due to an error'
      })
    } finally {
      // Always disconnect from the database
      try {
        await prisma.$disconnect()
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError)
      }
    }
  }

  if (req.method === 'PUT') {
    try {
      const items = req.body

      if (!Array.isArray(items)) {
        return res.status(400).json({ error: "Items must be an array" })
      }

      // Update all items in a transaction
      await prisma.$transaction(
        items.map((item) =>
          prisma.navigationItem.update({
            where: { id: item.id },
            data: {
              label: item.label,
              href: item.url || item.href, // Handle both url and href fields
              order: item.order,
              isActive: item.isActive
            }
          })
        )
      )

      return res.status(200).json({ message: "Navigation items updated successfully" })
    } catch (error) {
      console.error("Error updating navigation items:", error)
      return res.status(500).json({ error: "Failed to update navigation items" })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}

export default handler 