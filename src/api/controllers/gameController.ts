import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const applyItemEffect = async (userId: number, effect: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { userid: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  switch (effect) {
    // Click Power Powerups
    case 'Click Power +':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 0) + 1 },
      });
      break;
    case 'Click Power ++':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 0) + 5 },
      });
      break;
    case 'Click Power +++':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 0) + 15 },
      });
      break;

    // Click Multiplier Powerups
    case 'Click Multiplier x2':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 1) * 2 },
      });
      break;
    case 'Click Multiplier x3':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 1) * 3 },
      });
      break;
    case 'Click Multiplier x5':
      await prisma.user.update({
        where: { userid: userId },
        data: { pointsPerClick: (user.pointsPerClick || 1) * 5 },
      });
      break;

    // Auto Click Powerups
    case 'Auto Click':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickPurchased: true },
      });
      break;
    case 'Auto Click SPD +':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickInterval: Math.max((user.autoClickInterval || 2000) / 1.5, 100) },
      });
      break;
    case 'Auto Click SPD ++':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickInterval: Math.max((user.autoClickInterval || 2000) / 3, 50) },
      });
      break;
    case 'Auto Click Power +':
      await prisma.user.update({
        where: { userid: userId },
        data: { autoClickPower: (user.autoClickPower || 0) + 1, autoClickPurchased: true },
      });
      break;

    // Critical Hit Powerups
    case 'Critical Hit +':
      await prisma.user.update({
        where: { userid: userId },
        data: { criticalHitChance: (user.criticalHitChance || 0) + 0.05 },
      });
      break;
    case 'Critical Hit ++++':
      await prisma.user.update({
        where: { userid: userId },
        data: { criticalHitChance: (user.criticalHitChance || 0) + 0.25 },
      });
      break;

    // Combo Multiplier Powerups
    case 'Combo x1.5':
      await prisma.user.update({
        where: { userid: userId },
        data: { comboMultiplier: (user.comboMultiplier || 1) + 0.5 },
      });
      break;
    case 'Combo x2':
      await prisma.user.update({
        where: { userid: userId },
        data: { comboMultiplier: (user.comboMultiplier || 1) + 1 },
      });
      break;

    // Energy & Boost Powerups
    case 'Energy Boost':
      await prisma.user.update({
        where: { userid: userId },
        data: { energyBoosts: (user.energyBoosts || 0) + 1 },
      });
      break;
    case 'Energy Overdrive':
      const newBoostEnd = new Date(Date.now() + 60000); // 1 minute boost
      await prisma.user.update({
        where: { userid: userId },
        data: { 
          boostActive: true,
          boostEndTime: newBoostEnd,
          pointsPerClick: Math.floor((user.pointsPerClick || 1) * 3), // 3x damage during boost
        },
      });
      break;

    // Special/Exotic Powerups
    case 'Golden Touch':
      // Earn immediate bonus points
      await prisma.user.update({
        where: { userid: userId },
        data: { userScore: user.userScore + 500 },
      });
      break;
    case 'Time Warp':
      // Extreme speed boost
      await prisma.user.update({
        where: { userid: userId },
        data: { 
          autoClickInterval: 100,
          pointsPerClick: (user.pointsPerClick || 1) * 2,
        },
      });
      break;

    default:
      throw new Error('Unknown effect: ' + effect);
  }
};
