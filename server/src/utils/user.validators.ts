import { AppError } from "../errors/appError";
import { UserUpdateDTO } from "../interfaces/user.interfaces";

// Función auxiliar para capitalizar (Juan Perez)
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Regex para solo letras y espacios (permite tildes y ñ)
const nameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validarYFormatearDatos = (data: Partial<UserUpdateDTO>) => {
  const { nombre, apellido, email } = data;
  const datosFormateados: Partial<UserUpdateDTO> = {};

  // --- VALIDACIÓN DE NOMBRE ---
  if (nombre !== undefined) {
    const nombreTrim = nombre.trim();
    if (nombreTrim.length < 2 || nombreTrim.length > 50) {
      throw new AppError(
        "Error en nombre",
        400,
        "El nombre debe tener entre 2 y 50 caracteres."
      );
    }
    if (!nameRegex.test(nombreTrim)) {
      throw new AppError(
        "Error en nombre",
        400,
        "El nombre solo puede contener letras y espacios."
      );
    }
    datosFormateados.nombre = toTitleCase(nombreTrim);
  }

  // --- VALIDACIÓN DE APELLIDO ---
  if (apellido !== undefined) {
    const apellidoTrim = apellido.trim();
    if (apellidoTrim.length < 2 || apellidoTrim.length > 50) {
      throw new AppError(
        "Error en apellido",
        400,
        "El apellido debe tener entre 2 y 50 caracteres."
      );
    }
    if (!nameRegex.test(apellidoTrim)) {
      throw new AppError(
        "Error en apellido",
        400,
        "El apellido solo puede contener letras y espacios."
      );
    }
    datosFormateados.apellido = toTitleCase(apellidoTrim);
  }

  // --- VALIDACIÓN DE EMAIL ---
  if (email !== undefined) {
    const emailTrim = email.trim().toLowerCase();
    if (!emailRegex.test(emailTrim)) {
      throw new AppError(
        "Error en email",
        400,
        "El formato del correo electrónico no es válido."
      );
    }
    datosFormateados.email = emailTrim;
  }

  return datosFormateados;
};
