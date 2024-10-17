import { Request, Response } from 'express'; // Import types for Express request and response
import User from '../models/user.js'; // Import the User model
import { z } from 'zod';

// Define a Zod schema for validating user data
const UserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'verifier']),
});

// Controller function to fetch and return user information
export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    // Retrieve all users from the database
    const userList = await User.find();
    console.log(userList);

    // Send a successful response with the user data
    res.status(200).json(userList);
  } catch (err) {
    console.error('Error while retrieving users:', err);
    // Respond with a server error message if fetching users fails
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
