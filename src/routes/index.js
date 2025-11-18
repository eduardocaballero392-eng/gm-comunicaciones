import { Router } from "express";
import authRoutes from "./auth.routes.js";
import clientsRoutes from "./clients.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import invoicesRoutes from "./invoices.routes.js";
import productsRoutes from "./products.routes.js";
import statusRoutes from "./status.routes.js";

const router = Router();

router.use("/", statusRoutes);
router.use("/", authRoutes);
router.use("/clientes", clientsRoutes);
router.use("/productos", productsRoutes);
router.use("/facturas", invoicesRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;

