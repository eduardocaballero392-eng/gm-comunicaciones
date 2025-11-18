import { Router } from "express";
import env from "../config/env.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    message: "GM Comunicaciones API",
    status: "ok",
    version: "2.0.0",
    dataSource: env.dataSource,
    timestamp: new Date().toISOString(),
  });
});

export default router;

