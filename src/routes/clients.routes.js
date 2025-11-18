import { Router } from "express";
import {
  createClient,
  deleteClient,
  getClient,
  listClients,
  updateClient,
} from "../services/clients.service.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const clientes = await listClients();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const cliente = await getClient(req.params.id);
    res.json(cliente);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const nuevo = await createClient(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const actualizado = await updateClient(req.params.id, req.body);
    res.json(actualizado);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await deleteClient(req.params.id);
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    next(error);
  }
});

export default router;

