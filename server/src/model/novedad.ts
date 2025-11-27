import { HydratedDocument, Schema, Types, model } from "mongoose";

export interface INovedad {
  contenido: string;
  autor: Types.ObjectId;
  area: Types.ObjectId;
  etiquetas: string[];
}
const novedadSchema = new Schema(
  {
    contenido: {
      type: String,
      required: true,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    area: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      required: true,
    },

    etiquetas: {
      type: [String],
      default: [],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    audit_delete: {
      fecha: { type: Date },
      usuario_id: { type: Schema.Types.ObjectId, ref: "Usuario" },
      motivo: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
novedadSchema.index({ contenido: "text" });

export default model("Novedad", novedadSchema);
export type INovedadDocument = HydratedDocument<INovedad>;
