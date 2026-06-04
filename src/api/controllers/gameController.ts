import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyItemEffect = async (userId: number, effect: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { userid: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  switch (effect) {
    case 'Click Power +':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 0) + 1 },
      });
      break;
    case 'Click Multiplier +':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 1) * 2 },
      });
      break;
    case 'Auto Click':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickPurchased: true },
      });
      break;
    case 'Auto Click SPD +':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickInterval: Math.max((user.autoClickInterval || 2000) / 2, 100) },
      });
      break;
    default:
      throw new Error('Unknown effect');
  }
};