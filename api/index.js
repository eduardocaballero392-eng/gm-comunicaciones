// api/index.js - Punto de entrada para Vercel
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || "clave_secreta_super_segura";

// ---------------- Conexión a MySQL con variables de entorno ----------------
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "eduardo1",
  database: process.env.DB_NAME || "facturacion"
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
app.post("/api/register", (req, res) => {
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

app.post("/api/login", (req, res) => {
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
app.get("/api/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    res.json(results);
  });
});

app.get("/api/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(results[0]);
  });
});

app.post("/api/clientes", (req, res) => {
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

app.put("/api/clientes/:id", (req, res) => {
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

app.delete("/api/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clientes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar cliente." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  });
});

// ---------------- RUTAS FACTURAS ----------------
app.post("/api/facturas", (req, res) => {
  const { cliente_id, usuario_id, metodo, total, carrito } = req.body;

  const productosJSON = JSON.stringify(carrito);

  db.query("SELECT MAX(correlativo) AS ultimo FROM facturas", (err, result) => {
    if (err) {
      console.error("❌ Error al obtener correlativo:", err);
      return res.status(500).json({ error: "Error al generar correlativo" });
    }

    const nuevoCorrelativo = (result[0].ultimo || 0) + 1;

    db.query(
      "INSERT INTO facturas (cliente_id, usuario_id, correlativo, productos, metodo, total, fecha) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [cliente_id, usuario_id || 1, nuevoCorrelativo, productosJSON, metodo, total],
      (err, result) => {
        if (err) {
          console.error("❌ Error al guardar factura:", err);
          return res.status(500).json({ error: "Error al guardar factura" });
        }

        res.json({ 
          message: "Factura guardada con éxito", 
          facturaId: result.insertId,
          correlativo: nuevoCorrelativo
        });
      }
    );
  });
});

app.get("/api/facturas/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT f.*, c.nombre AS cliente_nombre FROM facturas f JOIN clientes c ON f.cliente_id = c.id WHERE f.id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("❌ Error al obtener factura:", err);
        return res.status(500).json({ error: "Error al obtener factura" });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }

      const factura = results[0];
      factura.productos = JSON.parse(factura.productos || "[]");

      res.json(factura);
    }
  );
});

app.get("/api/facturas", (req, res) => {
  db.query(
    `SELECT f.id, f.correlativo, c.nombre AS cliente_nombre, f.total, 
            COALESCE(f.metodo, 'N/A') AS metodo, f.fecha
     FROM facturas f
     JOIN clientes c ON f.cliente_id = c.id
     ORDER BY f.fecha DESC`,
    (err, results) => {
      if (err) {
        console.error("❌ Error al obtener facturas:", err);
        return res.status(500).json({ error: "Error al obtener facturas" });
      }
      res.json(results);
    }
  );
});

// ---------------- RUTAS PRODUCTOS ----------------
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error de servidor." });
    }
    res.json(results);
  });
});

app.get("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM productos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(results[0]);
  });
});

app.post("/api/productos", (req, res) => {
  const { nombre, precio, stock, categoria_id } = req.body;
  db.query(
    "INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES (?,?,?,?)",
    [nombre, precio, stock, categoria_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear producto." });
      res.json({ message: "Producto creado correctamente", id: result.insertId });
    }
  );
});

app.put("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock, categoria_id } = req.body;

  db.query(
    "UPDATE productos SET nombre = ?, precio = ?, stock = ?, categoria_id = ? WHERE id = ?",
    [nombre, precio, stock, categoria_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar producto." });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
      res.json({ message: "Producto actualizado correctamente" });
    }
  );
});

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar producto." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  });
});

// ---------------- DASHBOARD SUMMARY ----------------
app.get("/api/dashboard/summary", (req, res) => {
  const summary = {};

  const continuarProceso = () => {
    db.query(
      `SELECT metodo, COUNT(*) AS total 
       FROM facturas 
       WHERE metodo IS NOT NULL AND metodo != ''
       GROUP BY metodo`,
      (err, metodos) => {
        if (err) {
          console.warn("⚠️ Error en ventas por método:", err);
          summary.ventasPorMetodo = [];
        } else {
          summary.ventasPorMetodo = metodos || [];
        }

        db.query(
          `SELECT f.id, c.nombre AS cliente, f.total, 
                  COALESCE(f.metodo, 'N/A') AS metodo, 
                  f.fecha
           FROM facturas f
           JOIN clientes c ON f.cliente_id = c.id
           ORDER BY f.fecha DESC
           LIMIT 5`,
          (err, ultimas) => {
            if (err) {
              console.warn("⚠️ Error en últimas facturas:", err);
              summary.ultimasFacturas = [];
            } else {
              summary.ultimasFacturas = ultimas || [];
            }
            res.json(summary);
          }
        );
      }
    );
  };

  db.query("SELECT COUNT(*) AS totalClientes FROM clientes", (err, clientes) => {
    if (err) return res.status(500).json({ error: "Error en clientes" });
    summary.totalClientes = clientes[0]?.totalClientes || 0;

    db.query("SELECT COUNT(*) AS totalProductos FROM productos", (err, productos) => {
      if (err) return res.status(500).json({ error: "Error en productos" });
      summary.totalProductos = productos[0]?.totalProductos || 0;

      db.query("SELECT COUNT(*) AS totalFacturas FROM facturas", (err, facturas) => {
        if (err) {
          console.warn("⚠️ Tabla facturas no existe, devolviendo 0");
          summary.totalFacturas = 0;
          summary.ventasPorCategoria = [];
          summary.ventasPorMetodo = [];
          summary.ultimasFacturas = [];
          return res.json(summary);
        }
        summary.totalFacturas = facturas[0]?.totalFacturas || 0;

        db.query(`
          SELECT 
            MAX(c.nombre) AS categoria,
            COUNT(DISTINCT f.id) AS total_vendido
          FROM facturas f
          JOIN productos p ON JSON_CONTAINS(f.productos, JSON_OBJECT('id', p.id))
          JOIN categorias c ON p.categoria_id = c.id
          GROUP BY c.nombre
          ORDER BY total_vendido DESC
          LIMIT 4
        `, (err, categorias) => {
          if (err) {
            console.warn("⚠️ Error en categorías:", err);
            summary.ventasPorCategoria = [];
          } else {
            summary.ventasPorCategoria = categorias || [];
          }
          continuarProceso();
        });
      });
    });
  });
});

// Ruta raíz mejorada
app.get('/', (req, res) => {
  res.json({ 
    mensaje: "GM Comunicaciones API",
    status: "Funcionando",
    version: "1.0.0",
    rutas: [
      "/api/login",
      "/api/register",
      "/api/clientes",
      "/api/productos",
      "/api/facturas",
      "/api/dashboard/summary"
    ],
    documentacion: "Todas las rutas están disponibles bajo el prefijo /api"
  });
});

// Exportar para Vercel
export default app;

