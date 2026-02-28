export const getIniciales = (nombre: string, apellido: string) =>
  `${nombre[0]}${apellido[0]}`.toUpperCase();
