import dataSource from "../data/index.js";

export const createInvoice = async (payload) =>
  dataSource.facturas.create({
    ...payload,
    productos: payload.productos || [],
  });

export const getInvoice = async (id) => {
  const factura = dataSource.facturas.findById(id);
  if (!factura) {
    const error = new Error("Factura no encontrada");
    error.statusCode = 404;
    throw error;
  }
  return factura;
};

export const listInvoices = async () => dataSource.facturas.list();

