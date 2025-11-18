import { Router } from "express";
import { getSummary } from "../services/dashboard.service.js";

const router = Router();

router.get("/summary", async (_req, res, next) => {
  try {
    const summary = await getSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
});

export default router;

