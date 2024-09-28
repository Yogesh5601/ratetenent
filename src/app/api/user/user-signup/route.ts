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
  console.log('********SIGN-UP API CALLED*******');
  try {
    await dbConnect(); // Connect to the database

    const body = await req.json();
    
    // Validate input using Joi
    const { error } = signUpSchema.validate(body);
    if (error) {
      return NextResponse.json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { username, email, password, role } = body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create the new user (the password will be hashed automatically)
    const userDetail = { username, email, password, role };
    const result = await User.create(userDetail);

    return NextResponse.json({
      success: true,
      message: 'Sign-up successful',
    //   result,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Sign-up failed',
    });
  }
}
