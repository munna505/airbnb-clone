import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing pricing data
  await prisma.pricing.deleteMany()

  // Seed pricing data
  const pricingData = [
    // Home cleaning pricing
    { serviceType: 'HOME' as const, key: 'baseRate', price: 40 },
    { serviceType: 'HOME' as const, key: 'bedroom', price: 25 },
    { serviceType: 'HOME' as const, key: 'bathroom', price: 20 },
    { serviceType: 'HOME' as const, key: 'livingArea', price: 15 },
    
    // Airbnb cleaning pricing
    { serviceType: 'AIRBNB' as const, key: 'baseRate', price: 70 },
    { serviceType: 'AIRBNB' as const, key: 'bedroom', price: 25 },
    { serviceType: 'AIRBNB' as const, key: 'bathroom', price: 20 },
    { serviceType: 'AIRBNB' as const, key: 'livingArea', price: 15 },
    { serviceType: 'AIRBNB' as const, key: 'linenService', price: 15 },
    { serviceType: 'AIRBNB' as const, key: 'towelService', price: 10 },
  ]

  for (const pricing of pricingData) {
    await prisma.pricing.create({
      data: pricing
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
