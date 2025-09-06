// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 3001;
const SECRET_KEY = "clave_secreta_super_segura";

// ---------------- Conexión a MySQL ----------------
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "eduardo1",
  database: "facturacion"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la BD:", err.stack);
    return;
  }
  console.log("✅ Conectado a MySQL con ID:", db.threadId);
});

app.use(cors());
app.use(express.json());

// ---------------- RUTAS USUARIOS ----------------
app.post("/register", (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)",
    [nombre, email, hashedPassword, rol],
    (err) => {
      if (err) return res.status(500).json({ error: "Error al registrar usuario." });
      res.json({ message: "Usuario registrado correctamente." });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(401).json({ error: "Usuario o contraseña incorrectos." });

    const user = results[0];
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) return res.status(401).json({ error: "Usuario o contraseña incorrectos." });

    const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET_KEY, { expiresIn: "2h" });

    res.json({
      message: "✅ Login exitoso",
      token,
      rol: user.rol,
      nombre: user.nombre,
    });
  });
});

// ---------------- RUTAS CLIENTES ----------------

// Obtener todos los clientes
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    res.json(results);
  });
});

// Obtener un cliente por ID
app.get("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(results[0]);
  });
});

// Crear un nuevo cliente
app.post("/clientes", (req, res) => {
  const { nombre, email, telefono, direccion } = req.body;
  db.query(
    "INSERT INTO clientes (nombre, email, telefono, direccion) VALUES (?,?,?,?)",
    [nombre, email, telefono, direccion],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear cliente." });
      res.json({ message: "Cliente creado correctamente", id: result.insertId });
    }
  );
});

// Actualizar cliente
app.put("/clientes/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion } = req.body;

  db.query(
    "UPDATE clientes SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id = ?",
    [nombre, email, telefono, direccion, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar cliente." });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
      res.json({ message: "Cliente actualizado correctamente" });
    }
  );
});

// Eliminar cliente
app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clientes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar cliente." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  });
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
