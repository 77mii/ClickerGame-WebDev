import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany();
        console.log("Fetched posts:", posts); // Logging fetched posts
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error); // Logging error
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createPost = async (req: Request, res: Response) => {
    const { title, caption, authorId} = req.body;

    if(!title || !caption || !authorId) {
        res.json({error: "Please provide title, caption and authorId"});
        return;
    }
const validateUser = await prisma.user.findUnique({
    where: {
        id: authorId
    }
});
if(!validateUser) {
     res.json({error: "User not found"});
        return;
}
    const post = await prisma.post.create({


        data: {
            title,
            caption,
            authorId
        }
    });
    console.log("Created Post:", post); // Logging created post
    res.json(post);
}

export const deletePost = async (req: Request, res: Response) => {
    const {id} = req.body;

    const validatePost = await prisma.post.findUnique({
        where: {
            id: id
        }

    });

    if(!validatePost) {
       res.json({error: "Post not found"});
         return;
    }

    const deletedPost = await prisma.post.delete({
        where: {
            id: id
        }
    });

    console.log("Deleted Post:", deletedPost); // Logging deleted post
    res.json(deletedPost);
}

export const updatePost = async (req: Request, res: Response) => {
    const {id, title, caption} = req.body;

    if(!id || !title || !caption) {
        res.json({error: "Please provide id, title and caption"});
        return;
    }

    const validatePost = await prisma.post.findUnique({
        where: {
            id: id
        }
    });

    if(!validatePost) {
        res.json({error: "Post not found"});
        return;
    }
    const post = await prisma.post.update({
        where: {
            id: id
        },
        data: {
            title,
            caption
        }
    });

    console.log("Updated Post:", post); // Logging updated post
    res.json(post);
}