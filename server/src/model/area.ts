import { HydratedDocument, Schema, model } from "mongoose";

export interface IArea {
  nombre: string;
  descripcion: string;
}
const areaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    length: 50,
  },
  descripcion: {
    type: String,
    trim: true,
    default: "Ingrese una breve descripcion aqui",
    length: 255,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});
export default model("Area", areaSchema);
export type IAreaDocument = HydratedDocument<IArea>;
