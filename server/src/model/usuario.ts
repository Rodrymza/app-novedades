import { HydratedDocument, model, Schema, Types } from "mongoose";

export type Rol = "OPERADOR" | "SUPERVISOR";

export interface IUsuario {
  apellido: string;
  nombre: string;
  username: string;
  email: string;
  documento: string;
  password: string;
  rol: Rol;
  is_deleted: boolean;
  audit_delete?: {
    fecha: Date;
    usuario_id: Types.ObjectId;
    motivo: string;
  };
  audit_restore?: {
    fecha: Date;
    usuario_id: Types.ObjectId;
    motivo: string;
  };
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
    documento: {
      type: String,
      required: true,
      trim: true,
      length: 8,
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
    is_deleted: { type: Boolean, default: false },
    audit_delete: {
      fecha: { type: Date },
      usuario_id: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
      },
      motivo: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

userShema.index({ email: 1 });
userShema.index({ is_deleted: 1 });

export default model("Usuario", userShema);
export type IUsuarioDocument = HydratedDocument<IUsuario>;
