import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../services/products.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const productos = await listProducts();
    res.json(productos);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const producto = await getProduct(req.params.id);
    res.json(producto);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const nuevo = await createProduct(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const actualizado = await updateProduct(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
});

export default router;

