import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const createToken = (payload, expiresIn = "2h") =>
  jwt.sign(payload, env.secretKey, { expiresIn });

export const verifyToken = (token) => jwt.verify(token, env.secretKey);

