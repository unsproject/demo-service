import { model, Schema } from "mongoose";

export interface Message {
  serviceUserId: string;
  name: string;
  text: string;
}
const messageSchema = new Schema<Message>(
  {
    serviceUserId: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model("Message", messageSchema);
