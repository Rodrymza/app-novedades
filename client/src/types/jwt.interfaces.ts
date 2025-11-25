export interface JwtPayload {
  id: string;
  username: string;
  rol: "OPERADOR" | "SUPERVISOR";
}
