import dbConnect from "@/lib/dbConnect";
import { UserSignUp } from "@/models";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req:NextRequest){
    console.log("USER SIGNIN API CALLED")
    try {
        // const {username, password} = await req.json()
        const username = req.nextUrl.searchParams.get("username")
         const password = req.nextUrl.searchParams.get("password")
        console.log({username})

        if(!username ){
            return NextResponse.json({success:false, message:"username and password required"})
        }
          if(!password ){
            return NextResponse.json({success:false, message:"username and password required"})
        }

        await dbConnect()
        const user = await UserSignUp.findOne({username})
        console.log({user})
        if(!user){
         return NextResponse.json({message:"no user find or invalid user"})
        }

         const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
         return NextResponse.json({ message: "invalid password" });
        }
        return NextResponse.json({success:true, messager:"user sign succefully"})

    } catch (error:any) {
       return NextResponse.json({success:false, message: error.message || "sign in failed (invalid credentials) "}) 
    }
}