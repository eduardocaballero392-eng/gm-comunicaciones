import cors from "cors";
import express from "express";
import env from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

const createApp = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({
      mensaje: "GM Comunicaciones API",
      status: "✅ Funcionando correctamente",
      version: "2.0.0",
      entorno: env.nodeEnv,
      baseUrl: `${req.protocol}://${req.get("host")}`,
      rutas: {
        autenticacion: ["POST /api/login", "POST /api/register"],
        usuarios: ["GET /api/usuarios"],
        clientes: ["GET/POST /api/clientes", "GET/PUT/DELETE /api/clientes/:id"],
        productos: ["GET/POST /api/productos", "GET/PUT/DELETE /api/productos/:id"],
        facturas: ["GET /api/facturas", "GET /api/facturas/:id", "POST /api/facturas"],
        dashboard: ["GET /api/dashboard/summary"],
        status: ["GET /api/health"],
      },
      nota: "Puedes cambiar el origen de datos a MySQL cuando esté listo usando DATA_SOURCE=mysql.",
    });
  });

  app.use("/api", apiRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;

