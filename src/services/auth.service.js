import bcrypt from "bcryptjs";
import dataSource from "../data/index.js";
import { createToken } from "../utils/token.js";

export const registerUser = async ({ nombre, email, password, rol }) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return dataSource.usuarios.create({
    nombre,
    email,
    password: hashedPassword,
    rol,
  });
};

export const loginUser = async ({ email, password }) => {
  const user = dataSource.usuarios.findByEmail(email);

  if (!user) {
    const error = new Error("Usuario o contraseña incorrectos.");
    error.statusCode = 401;
    throw error;
  }

  const validPassword = bcrypt.compareSync(password, user.password);
  if (!validPassword) {
    const error = new Error("Usuario o contraseña incorrectos.");
    error.statusCode = 401;
    throw error;
  }

  const token = createToken({ id: user.id, rol: user.rol });
  const { password: _omit, ...safeUser } = user;

  return { token, user: safeUser };
};

export const listUsers = async () => dataSource.usuarios.list();

