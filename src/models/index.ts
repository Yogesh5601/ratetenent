import { model, models } from "mongoose";
import { userSchema } from "./User";

// export const UserSignUp = models.UserSingUp || model("userSignUp" , userSignUpSchema)
const User =
  models.User ||
  model('User', userSchema);


  export {User}