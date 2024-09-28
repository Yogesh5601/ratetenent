import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the schema for the User model
export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please enter a username'],
    unique: true,  // Unique username for users
  },
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,  // Ensure email is unique
    lowercase: true,  // Store email in lowercase
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],  // Validate email format
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: 6,  // Ensure the password is at least 6 characters long
  },
  role: {
    type: String,
    enum: ['tenant', 'landlord'],  // Only allow 'tenant' or 'landlord' roles
    required: true,  // Role is mandatory
  },
  resetToken: String,  // Optional field for password reset token
  resetTokenExpiration: Date,  // Optional field for password reset token expiry
}, { 
  timestamps: true  // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Index for faster lookup and uniqueness enforcement
UserSchema.index({ email: 1 }, { unique: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Generate salt and hash the password
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);
  next();
});

// Method to compare password with hashed password in the database
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};


