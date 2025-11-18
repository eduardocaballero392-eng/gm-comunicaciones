import { Router } from "express";
import { listUsers, loginUser, registerUser } from "../services/auth.service.js";

const router = Router();

router.post("/register", async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "Usuario registrado correctamente.", user });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña son requeridos." });
    }
    const { token, user } = await loginUser({ email, password });
    res.json({
      message: "✅ Login exitoso",
      token,
      rol: user.rol,
      nombre: user.nombre,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/usuarios", async (_req, res, next) => {
  try {
    const usuarios = await listUsers();
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
});

export default router;

