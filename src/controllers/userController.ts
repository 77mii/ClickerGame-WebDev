import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    console.log("Fetched users:", users); // Logging fetched users
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error); // Logging error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  
  const { email, username } = req.body;
  console.log("Request body:", req.body); // Logging request body

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
      },
    });
    console.log("Created user:", newUser); // Logging created user
    res.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error); // Logging error
    res.status(500).json({ error: "Internal Server Error" });
  }
};