// import express from 'express';
// import { updateScore, getUser, getAllUsers, registerUser } from './../controllers/userController';

// const router = express.Router();

// // Update score
// router.post('/update-score', updateScore);

// // Fetch user data
// router.get('/user/:id', getUser);

// router.get('/users', getAllUsers);

// router.post('/register', registerUser);

// export default router;


import { Router } from 'express';
import { updateScore, getUser, registerUser, getAllUsers, loginUser, deleteUser } from '../controllers/userController';

const router = Router();


// Update score
 router.post('/update-score', updateScore);

// Fetch user data
router.get('/user/:id', getUser);

// Fetch all users
router.get('/users', getAllUsers);

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

//Delete user
router.delete('/user/:id', deleteUser);

export default router;