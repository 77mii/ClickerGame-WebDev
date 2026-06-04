

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkDatabase = async () => {
  const shopItems = await prisma.shopItem.findMany();
  console.log('Shop Items in the database:', shopItems);
};

checkDatabase()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });