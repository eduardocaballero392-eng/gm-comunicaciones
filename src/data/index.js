import env from "../config/env.js";
import memoryStore from "./memoryStore.js";

const dataSources = {
  memory: memoryStore,
};

if (env.dataSource === "mysql") {
  console.warn("⚠️ DATA_SOURCE=mysql configurado, pero aún no hay adaptador. Usando memoria.");
}

const dataSource = dataSources[env.dataSource] || memoryStore;

export default dataSource;

