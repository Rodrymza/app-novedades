import { Document, HydratedDocument, model, Schema } from "mongoose";

export type Rol = "OPERADOR" | "SUPERVISOR";

export interface IUsuario {
  apellido: string;
  nombre : string;
  username : string;
  email: string;
  password: string;
  rol: Rol;

}

const userShema = new Schema<IUsuario>(
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
    password: {
      type: String,
      required: true,
      
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
export type IUsuarioDocument = HydratedDocument<IUsuario>;

