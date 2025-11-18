import dotenv from "dotenv";

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 3001,
  secretKey: process.env.SECRET_KEY || "clave_secreta_super_segura",
  dataSource: (process.env.DATA_SOURCE || "memory").toLowerCase(),
};

export default env;

