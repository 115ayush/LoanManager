// src/config/passportConfig.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import User from '../models/user.js'; // Adjust the import path according to your project structure

dotenv.config();

// Set up the Local Strategy for user authentication
const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  User.authenticate() // Use the authenticate method from the User model
);

// Use the local strategy with Passport
passport.use(localStrategy);

// Serialize user to store in the session
passport.serializeUser((user: any, done: Function) => {
  done(null, user._id); // Save the user ID in the session
});

// Deserialize user from session using the stored ID
passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const foundUser = await User.findById(id);
    done(null, foundUser);
  } catch (error) {
    done(error);
  }
});

export default passport;
