const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const initialPricing = [
  // Home Cleaning
  { serviceType: 'HOME', key: 'base_price', price: 50.00 },
  { serviceType: 'HOME', key: 'bedroom_price', price: 15.00 },
  { serviceType: 'HOME', key: 'bathroom_price', price: 20.00 },
  { serviceType: 'HOME', key: 'living_area_price', price: 10.00 },
  { serviceType: 'HOME', key: 'deep_cleaning', price: 25.00 },
  { serviceType: 'HOME', key: 'oven_cleaning', price: 30.00 },
  { serviceType: 'HOME', key: 'fridge_cleaning', price: 25.00 },
  { serviceType: 'HOME', key: 'window_cleaning', price: 20.00 },
  { serviceType: 'HOME', key: 'cabinet_cleaning', price: 15.00 },
  
  // Airbnb Cleaning
  { serviceType: 'AIRBNB', key: 'base_price', price: 75.00 },
  { serviceType: 'AIRBNB', key: 'bedroom_price', price: 20.00 },
  { serviceType: 'AIRBNB', key: 'bathroom_price', price: 25.00 },
  { serviceType: 'AIRBNB', key: 'living_area_price', price: 15.00 },
  { serviceType: 'AIRBNB', key: 'deep_cleaning', price: 35.00 },
  { serviceType: 'AIRBNB', key: 'oven_cleaning', price: 40.00 },
  { serviceType: 'AIRBNB', key: 'fridge_cleaning', price: 35.00 },
  { serviceType: 'AIRBNB', key: 'window_cleaning', price: 30.00 },
  { serviceType: 'AIRBNB', key: 'cabinet_cleaning', price: 25.00 },
  { serviceType: 'AIRBNB', key: 'laundry', price: 45.00 },
  { serviceType: 'AIRBNB', key: 'dishwashing', price: 20.00 },
  { serviceType: 'AIRBNB', key: 'bed_making', price: 15.00 },
  { serviceType: 'AIRBNB', key: 'towel_replacement', price: 25.00 },
  { serviceType: 'AIRBNB', key: 'amenity_restocking', price: 30.00 },
];

async function seedPricing() {
  try {
    console.log('Seeding pricing data...');

    for (const pricingItem of initialPricing) {
      await prisma.pricing.upsert({
        where: {
          serviceType_key: {
            serviceType: pricingItem.serviceType,
            key: pricingItem.key
          }
        },
        update: {
          price: pricingItem.price
        },
        create: {
          serviceType: pricingItem.serviceType,
          key: pricingItem.key,
          price: pricingItem.price
        }
      });
    }

    console.log('Pricing data seeded successfully!');
    
    // Display the seeded data
    const allPricing = await prisma.pricing.findMany({
      orderBy: [
        { serviceType: 'asc' },
        { key: 'asc' }
      ]
    });

    console.log('\nSeeded pricing items:');
    allPricing.forEach(item => {
      console.log(`${item.serviceType} - ${item.key}: $${item.price}`);
    });

  } catch (error) {
    console.error('Error seeding pricing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPricing();
