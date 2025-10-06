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
app.get("/clientes", (req, res) => {
  db.query("SELECT * FROM clientes", (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    res.json(results);
  });
});

app.get("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM clientes WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(results[0]);
  });
});

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

app.delete("/clientes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM clientes WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar cliente." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  });
});

// ---------------- RUTAS FACTURAS ----------------
app.post("/facturas", (req, res) => {
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

// ✅ Obtener una factura por ID (para detalle/imprimir)
app.get("/facturas/:id", (req, res) => {
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

// ---------------- RUTAS PRODUCTOS ----------------
app.get("/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error de servidor." });
    }
    res.json(results);
  });
});

app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM productos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error de servidor." });
    if (results.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(results[0]);
  });
});

app.post("/productos", (req, res) => {
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

app.put("/productos/:id", (req, res) => {
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

app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar producto." });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  });
});

// ---------------- DASHBOARD SUMMARY ----------------
app.get("/dashboard/summary", (req, res) => {
  const summary = {};

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

        db.query(
          `SELECT c.nombre AS categoria, SUM(df.cantidad) AS total
           FROM detalle_factura df
           JOIN productos p ON df.producto_id = p.id
           JOIN categorias c ON p.categoria_id = c.id
           GROUP BY c.nombre`,
          (err, categorias) => {
            if (err) {
              console.warn("⚠️ Error en ventas por categoría, devolviendo []");
              summary.ventasPorCategoria = [];
            } else {
              summary.ventasPorCategoria = categorias || [];
            }

            db.query(
              `SELECT p.metodo, COUNT(*) AS total 
               FROM pagos p
               GROUP BY p.metodo`,
              (err, metodos) => {
                if (err) {
                  console.warn("⚠️ Error en ventas por método, devolviendo []");
                  summary.ventasPorMetodo = [];
                } else {
                  summary.ventasPorMetodo = metodos || [];
                }

                db.query(
                  `SELECT f.id, c.nombre AS cliente, f.total, 
                          COALESCE(p.metodo, 'N/A') AS metodo, 
                          f.fecha
                   FROM facturas f
                   JOIN clientes c ON f.cliente_id = c.id
                   LEFT JOIN pagos p ON f.id = p.factura_id
                   ORDER BY f.fecha DESC
                   LIMIT 5`,
                  (err, ultimas) => {
                    if (err) {
                      console.warn("⚠️ Error en últimas facturas, devolviendo []");
                      summary.ultimasFacturas = [];
                    } else {
                      summary.ultimasFacturas = ultimas || [];
                    }
                    res.json(summary);
                  }
                );
              }
            );
          }
        );
      });
    });
  });
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
