// // import { PrismaClient } from '@prisma/client';

// // const prisma = new PrismaClient();

// // const items = [
// //   { itemname: 'Click Power +', price: 10, effect: 'Click Power +' },
// //   { itemname: 'Click Multiplier +', price: 200, effect: 'Click Multiplier +' },
// //   { itemname: 'Auto Click', price: 100, effect: 'Auto Click' },
// //   { itemname: 'Auto Click SPD +', price: 250, effect: 'Auto Click SPD +' },
// // ];

// // const seed = async () => {
// //   for (const item of items) {
// //     await prisma.item.upsert({
// //       where: { itemname_ownerId: { itemname: item.itemname, ownerId: null } },
// //       update: {},
// //       create: {
// //         itemname: item.itemname,
// //         price: item.price,
// //         effect: item.effect,
// //         ownerId: null, // Assuming no owner initially
// //       },
// //     });
// //   }
// //   console.log('Database has been seeded.');
// // };

// // seed()
// //   .catch(e => {
// //     console.error(e);
// //     process.exit(1);
// //   })
// //   .finally(async () => {
// //     await prisma.$disconnect();
// //   });




// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const shopItems = [
//   { itemname: 'Click Power +', price: 10, effect: 'Click Power +' },
//   { itemname: 'Click Multiplier +', price: 200, effect: 'Click Multiplier +' },
//   { itemname: 'Auto Click', price: 100, effect: 'Auto Click' },
//   { itemname: 'Auto Click SPD +', price: 250, effect: 'Auto Click SPD +' },
// ];

// const seedShopItems = async () => {
//   for (const item of shopItems) {
//     await prisma.shopItem.upsert({
//       where: { itemname: item.itemname },
//       update: {},
//       create: {
//         itemname: item.itemname,
//         price: item.price,
//         effect: item.effect,
//       },
//     });
//   }
//   console.log('Shop items have been seeded.');
// };

// seedShopItems()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


