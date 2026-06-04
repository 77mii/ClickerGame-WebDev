import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { applyItemEffect } from './gameController';

const prisma = new PrismaClient();

export const getShopItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await prisma.shopItem.findMany();
    res.json(items);
  } catch (error) {
    console.error('Error fetching shop items:', error);
    res.status(500).json({ error: 'Failed to fetch shop items' });
  }
};

export const purchaseItem = async (req: Request, res: Response): Promise<void> => {
  const { userId, itemId } = req.body;
  try {
    const item = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!item) {
       res.status(404).json({ error: 'Item not found' });
       return;
    }
  
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
  
    if (user.userScore < item.price) {
       res.status(400).json({ error: 'Insufficient score' });
    }
  
    await prisma.user.update({
      where: { userid: userId },
      data: { userScore: user.userScore - item.price },
    });
  
    await applyItemEffect(userId, item.effect);
  
     res.json({ message: 'Item purchased successfully' });
  } catch (error) {
    console.error('Error purchasing item:', error);
     res.status(500).json({ error: 'Failed to purchase item' });
  }
};