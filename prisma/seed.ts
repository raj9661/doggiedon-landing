import { PrismaClient } from '@prisma/client'
import { defaultNavigationItems } from '../lib/navigation'

const prisma = new PrismaClient()

async function main() {
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