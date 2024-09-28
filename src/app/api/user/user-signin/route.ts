// POST method - Sign In User
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";
import Joi from "joi";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 

// Input validation schema for sign-up
const signUpSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),  // Add email validation
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])"))
    .required(),
  role: Joi.string().valid("tenant", "landlord").required(),
});

export async function POST(req: NextRequest) {
  console.log('**********USER SIGN-IN API CALLED***************');
  try {
    await dbConnect(); // Connect to the database

    const body = await req.json();
    const { username, password } = body.params;
    console.log({body})

    // Check if username and password are provided
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: 'User not found or invalid username',
      });
    }

    // Compare the entered password with the hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({
        success: false,
        message: 'Invalid password',
      });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    // Create a response and set the token in a cookie
    const res = NextResponse.json({
      success: true,
      message: 'User signed in successfully',
    });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 3600, // 1 hour in seconds
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Sign-in failed (invalid credentials)',
    });
  }
}
