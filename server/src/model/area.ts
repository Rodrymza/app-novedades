import { Schema, model } from "mongoose";

const areaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
    default: "Ingrese una breve descripcion aqui",
    length: 255,
  },
});
export default model("Area", areaSchema);
