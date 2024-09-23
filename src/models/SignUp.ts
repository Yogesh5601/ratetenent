import { Schema } from "mongoose";

export const userSignUpSchema = new Schema({
    username: {
        type:String,
        unique:true,
    },
    category:{
        type:String,
        required:false,
    },
    password:{
       type:String
    }
})