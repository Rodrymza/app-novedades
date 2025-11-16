import { model, Schema } from "mongoose";

const userShema = new Schema(
  {
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    rol: {
      type: String,
      enum: ["OPERADOR", "SUPERVISOR"],
      default: "OPERADOR",
    },
  },
  {
    timestamps: true,
  }
);

export default model('Usuario', userShema);