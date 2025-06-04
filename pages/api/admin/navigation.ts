import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "@/lib/prisma"

type NavigationItem = {
  id: string
  label: string
  url: string
  order: number
  isExternal: boolean
  isActive: boolean
}

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
  if (req.method === 'GET') {
    try {
      const items = await prisma.navigationItem.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          label: true,
          href: true,
          order: true,
          isActive: true
        }
      })

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

      return res.status(200).json({ items: transformedItems })
    } catch (error) {
      console.error("Error fetching navigation items:", error)
      return res.status(500).json({ error: "Failed to fetch navigation items" })
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