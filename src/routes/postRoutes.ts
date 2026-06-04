import {Router} from "express";

import { deletePost, getAllPosts, updatePost } from "../controllers/postController";
import { createPost } from "../controllers/postController";

const router = Router()
router.get("/",getAllPosts)
router.post("/",createPost)
router.delete("/",deletePost)
router.put("/",updatePost)
export default router
