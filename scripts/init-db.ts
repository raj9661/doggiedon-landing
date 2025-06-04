import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  try {
    // Create admin user
    const adminExists = await prisma.admin.findUnique({
      where: { username: process.env.ADMIN_USERNAME },
    })

    if (!adminExists) {
      const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD!)
      await prisma.admin.create({
        data: {
          username: process.env.ADMIN_USERNAME!,
          password: hashedPassword,
        },
      })
      console.log('Admin user created')
    }

    // Create default navigation items
    const defaultNavigationItems = [
      {
        label: "Home",
        href: "/",
        order: 1,
        isActive: true,
      },
      {
        label: "About",
        href: "/about",
        order: 2,
        isActive: true,
      },
      {
        label: "Donate",
        href: "https://www.paypal.com/donate/your-paypal-link", // Replace with your PayPal link
        order: 3,
        isActive: true,
      },
      {
        label: "Download App",
        href: "https://example.com/doggiedon.apk", // Replace with your APK download link
        order: 4,
        isActive: true,
      },
      {
        label: "Blog",
        href: "/blog",
        order: 5,
        isActive: true,
      },
    ]

    // Check if navigation items exist
    const existingItems = await prisma.navigationItem.findMany()
    
    if (existingItems.length === 0) {
      await prisma.navigationItem.createMany({
        data: defaultNavigationItems,
      })
      console.log('Default navigation items created')
    }

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 