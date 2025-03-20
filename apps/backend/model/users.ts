import { model, Schema } from "mongoose";

interface User {
  serviceUserId: string;
}
const userSchema = new Schema<User>({
  serviceUserId: { type: String, required: true },
});

export const UserModel = model("User", userSchema);
