import {Router} from "express";
import {getAllUsers} from "../controllers/userController"
import {createUser} from "../controllers/userController"
const router = Router()


router.post("/", createUser)
router.get("/", getAllUsers)
export default router 