import { model, models } from "mongoose";
import { UserSchema } from "./User";

const User =
  models.User ||
  model('User', UserSchema);


  export {User}