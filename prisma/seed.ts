import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing pricing data

  await prisma.pricing.deleteMany()

  // Seed pricing data
  const pricingData = [
    // Home cleaning pricing
    { serviceType: 'HOME', key: 'baseRate', price: 40 },
    { serviceType: 'HOME', key: 'bedroom', price: 25 },
    { serviceType: 'HOME', key: 'bathroom', price: 20 },
    { serviceType: 'HOME', key: 'livingArea', price: 15 },
    
    // Airbnb cleaning pricing
    { serviceType: 'AIRBNB', key: 'baseRate', price: 70 },
    { serviceType: 'AIRBNB', key: 'bedroom', price: 25 },
    { serviceType: 'AIRBNB', key: 'bathroom', price: 20 },
    { serviceType: 'AIRBNB', key: 'livingArea', price: 15 },
    { serviceType: 'AIRBNB', key: 'linenService', price: 15 },
    { serviceType: 'AIRBNB', key: 'towelService', price: 10 },
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
