import { Schema, model } from "mongoose";

const novedadSchema = new Schema(
  {
    contenido: {
      type: String,
      required: true,
    },
    autor: {
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
  },
  {
    timestamps: true,
  }
);

export default model("Novedad", novedadSchema);
