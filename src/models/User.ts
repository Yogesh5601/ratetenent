import { Schema } from "mongoose";

export const userSchema = new Schema({
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