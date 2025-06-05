import { PrismaClient } from '@prisma/client'
import { defaultNavigationItems } from '../lib/navigation'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user if it doesn't exist
  const defaultAdmin = await prisma.admin.findUnique({
    where: { username: 'admin' }
  })

  if (!defaultAdmin) {
    const hashedPassword = await hashPassword('admin123') // Default password: admin123
    await prisma.admin.create({
      data: {
        username: 'admin',
        password: hashedPassword,
      }
    })
    console.log('Default admin user created')
  }

  // Seed navigation items
  for (const item of defaultNavigationItems) {
    await prisma.navigationItem.create({
      data: {
        id: item.id,
        label: item.label,
        href: item.href,
        order: item.order,
        isActive: item.isActive
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 