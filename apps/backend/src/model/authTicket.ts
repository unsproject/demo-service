import { model, Schema } from "mongoose";
import { AuthTicket } from "@unsproject/common";

const authTicketSchema = new Schema<AuthTicket>(
  {
    status: {
      type: String,
      enum: ["CREATED", "CLAIMED", "AUTHORIZED"],
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    attestationTypeRequired: {
      type: String,
      enum: [
        "none",
        "email_not_verified",
        "email_verified",
        "pinned_with_pki",
        "webauthn",
        "pki",
      ],
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    gatekeeperUrl: {
      type: String,
      required: true,
    },
    nonce: {
      type: String,
      required: true,
    },
    guardianUrl: {
      type: String,
    },
    qrCodeUrl: {
      type: String,
    },
    serviceUserId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const AuthTicketModel = model("AuthTicket", authTicketSchema);
