import bcrypt from "bcryptjs";

export const hashearPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const validarPassword = async (password: string, hashedPass: string) => {
  return bcrypt.compare(password, hashedPass);
};
