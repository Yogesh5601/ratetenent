import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use an environment variable for your secret

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

    const checkuser = await User.findOne({username})
    if(checkuser){
      return NextResponse.json({success:false, message:"user alredy exist"})
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
    const result = await User.create(userDetail)

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



export async function GET(req:NextRequest){
    console.log("**********USER SIGNIN API CALLED***************")
    try {
        const username = req.nextUrl.searchParams.get("username")
         const password = req.nextUrl.searchParams.get("password")

        if(!username ){
            return NextResponse.json({success:false, message:"username and password required"})
        }
          if(!password ){
            return NextResponse.json({success:false, message:"username and password required"})
        }
        console.log({username, password})
        await dbConnect()
        const user = await User.findOne({username})
        console.log({user})
        if(!user){
         return NextResponse.json({message:"no user find or invalid user"})
        }

         const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
         return NextResponse.json({ message: "invalid password" });
        }
         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1m" });

        const res = NextResponse.json({ success: true, message: "User signed in successfully" });

        // Set the token in a cookie
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            path: '/',
            // maxAge: 60, // 24 hours
        });

        return res;

    } catch (error:any) {
       return NextResponse.json({success:false, message: error.message || "sign in failed (invalid credentials) "}) 
    }
}