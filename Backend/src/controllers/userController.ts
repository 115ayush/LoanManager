import { Request, Response, NextFunction } from 'express';
import User from '../models/user.js';
import { MongoError } from 'mongodb';
import passportConfig from "../config/passportConfig.js";

// Register a new user
export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  console.log('Received request body:', req.body);

  // Check if both email and password are provided
  if (!email || !password) {
    res.status(400).json({ message: 'Both email and password are required.' });
    return;
  }

  try {
    // Create a new user instance and register using the password hashing plugin
    const userInstance = new User({ email });
    await User.register(userInstance, password);
    console.log('New user created:', userInstance);

    res.status(201).json({ message: 'User registration successful', user: userInstance });
  } catch (err) {
    console.error('Error during registration:', err);
    if (err instanceof MongoError) {
      res.status(400).json({ message: 'This email is already registered.' });
    } else if (err instanceof Error) {
      res.status(500).json({ message: 'User registration error', error: err.message });
    } else {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  }
};

// Log in the user
export const loginUser = (req: Request, res: Response, next: NextFunction): void => {
  console.log('Incoming login request:', req.body);

  passportConfig.authenticate('local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ message: 'Authentication error', error: err });
    }

    if (!user) {
      console.log('Login failed:', info.message);
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Login failed', error: err });
      }
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
};

// Log out the user
export const logoutUser = (req: Request, res: Response, next: NextFunction): void => {
  req.logout((err: any) => {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error during logout', error: err.message });
    } else {
      res.status(200).json({ message: 'Logout successful' });
    }
  });
};

// Fetch authenticated user information
export const fetchAuth = (req: Request, res: Response): void => {
  if (req.isAuthenticated()) {
    res.json(req.user); // Return user information if authenticated
  } else {
    res.json(null); // Return null if not authenticated
  }
};
