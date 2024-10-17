// src/routes/userRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, logoutUser, fetchAuth } from '../controllers/userController.js';
import passport from 'passport';

const userRouter = Router();

// Endpoint for user registration
userRouter.post('/register', registerUser);

// Endpoint for user login
userRouter.post('/login', loginUser);

// Endpoint for user logout
userRouter.post('/logout', logoutUser);

// Endpoint to fetch authenticated user information
userRouter.get('/fetch-auth', fetchAuth);

export default userRouter;
