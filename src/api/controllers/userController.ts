

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const secretKey = process.env.JWT_SECRET || 'your-secret-key';
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateScore = async (req: Request, res: Response): Promise<void> => {
  const { userId, score } = req.body;
  try {
    await prisma.user.update({
      where: { userid: userId },
      data: { userScore: score },
    });
    res.json({ message: 'Score updated successfully' });
  } catch (error) {
    console.error('Error updating score:', error);
    res.status(500).json({ error: 'Failed to update score' });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { userid: Number(id) } });
    if (!user) {
       res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || user.password !== password) {
       res.status(401).json({ error: 'Invalid username or password' });
       return;
    }

    const token = jwt.sign({ userId: user.userid }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    // check if username is taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
       res.status(400).json({ error: 'Username already taken' });
    }

    // pw creation
    const newUser = await prisma.user.create({
      data: {
        username,
        password, 
      },
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
  
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { userid: Number(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const updateSelectedImage = async (req: Request, res: Response): Promise<void> => {
  const { userId, imageName } = req.body;
  const validImages = ['capybara', 'react', 'pizza', 'rocket', 'star', 'diamond'];
  
  try {
    if (!validImages.includes(imageName)) {
      res.status(400).json({ error: 'Invalid image selection' });
      return;
    }
    
    await prisma.user.update({
      where: { userid: Number(userId) },
      data: { selectedImage: imageName },
    });
    res.json({ message: 'Image preference updated successfully', selectedImage: imageName });
  } catch (error) {
    console.error('Error updating image preference:', error);
    res.status(500).json({ error: 'Failed to update image preference' });
  }
};