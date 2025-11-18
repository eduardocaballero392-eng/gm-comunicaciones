import dataSource from "../data/index.js";

export const listClients = async () => dataSource.clientes.list();

export const getClient = async (id) => {
  const cliente = dataSource.clientes.findById(id);
  if (!cliente) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return cliente;
};

export const createClient = async (payload) => dataSource.clientes.create(payload);

export const updateClient = async (id, payload) => {
  const updated = dataSource.clientes.update(id, payload);
  if (!updated) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

export const deleteClient = async (id) => {
  const removed = dataSource.clientes.remove(id);
  if (!removed) {
    const error = new Error("Cliente no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return removed;
};

