import { HydratedDocument, Schema, model } from "mongoose";
import { PrioridadNovedad } from "../interfaces/novedad.interface";

export interface IPlantilla {
  nombre: string;
  tags: string[];
  contenido: string;
  prioridad: PrioridadNovedad;
  is_deleted: boolean;
}

const plantillaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  contenido: {
    type: String,
    required: true,
  },
  prioridad: {
    type: String,
    enum: Object.values(PrioridadNovedad),
    default: PrioridadNovedad.RUTINA,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

export default model("Plantillla", plantillaSchema);
export type IPlantillaDocument = HydratedDocument<IPlantilla>;
