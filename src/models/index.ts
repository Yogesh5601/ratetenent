import { model, models } from "mongoose";
import { userSignUpSchema } from "./SignUp";

// export const UserSignUp = models.UserSingUp || model("userSignUp" , userSignUpSchema)
const UserSignUp =
  models.UserSignUp ||
  model('UserSignUp', userSignUpSchema);


  export {UserSignUp}