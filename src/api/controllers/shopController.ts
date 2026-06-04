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

export const getUserItems = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  try {
    const items = await prisma.item.findMany({ 
      where: { ownerId: Number(userId) },
      include: { owner: true }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({ error: 'Failed to fetch user items' });
  }
};

export const purchaseItem = async (req: Request, res: Response): Promise<void> => {
  const { userId, itemId } = req.body;
  try {
    const shopItem = await prisma.shopItem.findUnique({ where: { id: itemId } });
    if (!shopItem) {
       res.status(404).json({ error: 'Item not found' });
       return;
    }
  
    const user = await prisma.user.findUnique({ where: { userid: userId } });
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return;
    }
  
    if (user.userScore < shopItem.price) {
       res.status(400).json({ error: 'Insufficient points. You need ' + (shopItem.price - user.userScore) + ' more points.' });
       return;
    }
  
    // Deduct points
    await prisma.user.update({
      where: { userid: userId },
      data: { userScore: user.userScore - shopItem.price },
    });
  
    // Save the purchased item to user's inventory
    const purchasedItem = await prisma.item.create({
      data: {
        itemname: shopItem.itemname,
        price: shopItem.price,
        effect: shopItem.effect,
        ownerId: userId,
      },
    });

    // Apply the item effect to the user
    await applyItemEffect(userId, shopItem.effect);
  
    res.json({ 
      message: 'Item purchased successfully!',
      item: purchasedItem,
      remainingScore: user.userScore - shopItem.price
    });
  } catch (error) {
    console.error('Error purchasing item:', error);
     res.status(500).json({ error: 'Failed to purchase item' });
  }
};
