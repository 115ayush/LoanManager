// src/models/user.ts
import mongoose, { Document, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

// Define the interface for a User document
interface IUser extends Document {
  email: string;
  password: string; // Managed by the passport-local-mongoose plugin
  role: 'user' | 'admin' | 'verifier'; // Specify the types of roles
}

// Create the User schema
const userSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { 
    type: String, 
    enum: ['user', 'admin', 'verifier'], // Define valid role options
    default: 'user' // Default role is set to 'user'
  },
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Apply the passport-local-mongoose plugin
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
});

// Create and export the User model
const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
