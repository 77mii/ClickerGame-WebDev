import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const shopItems = [
  // Click Power Powerups
  { itemname: 'Click Power +', price: 10, effect: 'Click Power +' },
  { itemname: 'Mega Click', price: 50, effect: 'Click Power ++' },
  { itemname: 'Ultimate Strike', price: 150, effect: 'Click Power +++' },
  
  // Multiplier Powerups
  { itemname: 'Click Multiplier x2', price: 200, effect: 'Click Multiplier x2' },
  { itemname: 'Click Multiplier x3', price: 500, effect: 'Click Multiplier x3' },
  { itemname: 'Click Multiplier x5', price: 1200, effect: 'Click Multiplier x5' },
  
  // Auto Click Powerups
  { itemname: 'Auto Click', price: 100, effect: 'Auto Click' },
  { itemname: 'Auto Click Power +', price: 120, effect: 'Auto Click Power +' },
  { itemname: 'Auto Click SPD +', price: 250, effect: 'Auto Click SPD +' },
  { itemname: 'Lightning Speed', price: 600, effect: 'Auto Click SPD ++' },
  
  // Critical Hit Powerups
  { itemname: 'Critical Hit Chance +', price: 75, effect: 'Critical Hit +' },
  { itemname: 'Precision Strike', price: 300, effect: 'Critical Hit ++++' },
  
  // Combo & Multiplier
  { itemname: 'Combo Boost', price: 180, effect: 'Combo x1.5' },
  { itemname: 'Extreme Combo', price: 450, effect: 'Combo x2' },
  
  // Energy & Boost
  { itemname: 'Energy Boost Pack', price: 60, effect: 'Energy Boost' },
  { itemname: 'Energy Overdrive', price: 350, effect: 'Energy Overdrive' },
  
  // Special/Exotic
  { itemname: 'Golden Touch', price: 1000, effect: 'Golden Touch' },
  { itemname: 'Time Warp', price: 800, effect: 'Time Warp' },
];

const seedShopItems = async () => {
  try {
    for (const item of shopItems) {
      await prisma.shopItem.upsert({
        where: { itemname: item.itemname },
        update: {},
        create: {
          itemname: item.itemname,
          price: item.price,
          effect: item.effect,
        },
      });
    }
    console.log('✨ Shop items have been seeded successfully!');
  } catch (error) {
    console.error('Error seeding shop items:', error);
  }
};

seedShopItems()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


