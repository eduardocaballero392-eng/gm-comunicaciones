import dataSource from "../data/index.js";

export const listProducts = async () => dataSource.productos.list();

export const getProduct = async (id) => {
  const producto = dataSource.productos.findById(id);
  if (!producto) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return producto;
};

export const createProduct = async (payload) => dataSource.productos.create(payload);

export const updateProduct = async (id, payload) => {
  const updated = dataSource.productos.update(id, payload);
  if (!updated) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

export const deleteProduct = async (id) => {
  const removed = dataSource.productos.remove(id);
  if (!removed) {
    const error = new Error("Producto no encontrado");
    error.statusCode = 404;
    throw error;
  }
  return removed;
};

