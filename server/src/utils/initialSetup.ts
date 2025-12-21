import Usuario from "../model/usuario";
import { hashearPassword } from "./hashPassword";

export const crearSupervisorPorDefecto = async () => {
  try {
    // 1. Contamos cuántos usuarios hay en la colección
    const count = await Usuario.countDocuments();

    // 2. Si ya existen usuarios, no hacemos nada (retornamos)
    if (count > 0) return;

    // 3. Si NO hay usuarios, creamos el Supervisor Inicial
    console.log(
      "⚠️ Base de datos vacía detectada. Creando Usuario Supervisor por defecto..."
    );

    const passwordHash = await hashearPassword("admin123"); // Contraseña inicial

    const values = {
      nombre: "Super",
      apellido: "Visor",
      username: "admin",
      email: "admin@admin.com",
      documento: "00000000", // Un DNI genérico
      password: passwordHash,
      rol: "SUPERVISOR", // Tu rol más alto actual
      is_deleted: false,
    };

    const nuevoUsuario = await Usuario.create(values);

    console.log("✅ Supervisor creado con éxito:");
    console.log(`   User: ${values.username}`);
    console.log(`   Pass: admin123`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("❌ Error creando usuario inicial:", error);
  }
};
