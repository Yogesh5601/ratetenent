import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import { UserSignUp } from "@/models";

// const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use an environment variable for your secret

export async function POST(req: NextRequest) {
  console.log("********SIGN-UP API CALLED*******");
  try {
    const body = await req.json();
    const { username, password } = body;

    // Check if username and password are provided
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const userDetail = {
      username,
      password: hashPassword,
    };

    console.log({userDetail})

    // Here you would typically save the user to your database
   await dbConnect()
    const result = await UserSignUp.create(userDetail)

    // Generate a JWT token
    // const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({
      success: true,
      message: "Sign up success",
      result
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: error.message || "Sign up failed",
    });
  }
}

