import { Router } from "express";
import { createInvoice, getInvoice, listInvoices } from "../services/invoices.service.js";

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    // Mapear el carrito para incluir nombres de servicios
    const carrito = req.body.carrito || req.body.productos || [];
    const productos = carrito.map(item => ({
      id: item.producto_id || item.id,
      nombre: item.nombre || 'Servicio',
      cantidad: item.cantidad || 1,
      precio: item.precio || 0
    }));
    
    const payload = {
      ...req.body,
      productos: productos,
    };
    const factura = await createInvoice(payload);
    res.status(201).json({
      message: "Factura guardada con éxito",
      facturaId: factura.id,
      correlativo: factura.correlativo,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async (_req, res, next) => {
  try {
    const facturas = await listInvoices();
    res.json(facturas);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const factura = await getInvoice(req.params.id);
    res.json(factura);
  } catch (error) {
    next(error);
  }
});

export default router;

