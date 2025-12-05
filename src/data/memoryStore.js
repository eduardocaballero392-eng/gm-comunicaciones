import bcrypt from "bcryptjs";

const categories = [
  { id: 1, nombre: "Equipos" },
  { id: 2, nombre: "Accesorios" },
  { id: 3, nombre: "Servicios" },
  { id: 4, nombre: "Repuestos" },
];

const productos = [
  { id: 1, nombre: "Router Empresarial", precio: 480.0, stock: 12, categoriaId: 1 },
  { id: 2, nombre: "Switch 24 Puertos", precio: 650.5, stock: 7, categoriaId: 1 },
  { id: 3, nombre: "Cable UTP 30m", precio: 45.9, stock: 80, categoriaId: 2 },
  { id: 4, nombre: "Soporte Técnico Express", precio: 150.0, stock: 999, categoriaId: 3 },
  { id: 5, nombre: "Antena Repuesto", precio: 75.5, stock: 25, categoriaId: 4 },
];

const clientes = [
  { id: 1, nombre: "GM Comunicaciones", email: "contacto@gm.com", telefono: "987654321", direccion: "Av. Tecnologías 123" },
  { id: 2, nombre: "Innova Telecom", email: "ventas@innova.com", telefono: "956321478", direccion: "Jr. Innovación 456" },
  { id: 3, nombre: "ServiRed", email: "info@servired.com", telefono: "945612378", direccion: "Calle Redes 789" },
];

const usuarios = [
  {
    id: 1,
    nombre: "Administrador",
    email: "admin@test.com",
    password: bcrypt.hashSync("admin123", 10),
    rol: "admin",
  },
  {
    id: 2,
    nombre: "Usuario Demo",
    email: "user@test.com",
    password: bcrypt.hashSync("user123", 10),
    rol: "usuario",
  },
];

const facturas = [
  {
    id: 1,
    correlativo: 1,
    cliente_id: 1,
    usuario_id: 1,
    metodo: "Transferencia",
    total: 4900.0, // 2500 + 1500 + 900
    productos: [
      { id: 1, nombre: "Agencia de Prensa y Relaciones Públicas", cantidad: 1, precio: 2500.0 },
      { id: 4, nombre: "Community Manager", cantidad: 1, precio: 1500.0 },
      { id: 5, nombre: "Monitoreo de Medios", cantidad: 1, precio: 900.0 },
    ],
    fecha: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    correlativo: 2,
    cliente_id: 2,
    usuario_id: 2,
    metodo: "Efectivo",
    total: 5000.0, // 1800 + 1200 + 2000
    productos: [
      { id: 2, nombre: "Media Training", cantidad: 1, precio: 1800.0 },
      { id: 3, nombre: "Creatividad Gráfica", cantidad: 1, precio: 1200.0 },
      { id: 6, nombre: "Diseño Web", cantidad: 1, precio: 2000.0 },
    ],
    fecha: new Date(Date.now() - 172800000).toISOString(),
  },
];

const clone = (value) => JSON.parse(JSON.stringify(value));
const getNextId = (items) => (items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1);

const memoryStore = {
  usuarios: {
    list: () => clone(usuarios.map(({ password, ...rest }) => rest)),
    findByEmail: (email) => usuarios.find((user) => user.email.toLowerCase() === email.toLowerCase()),
    create: ({ nombre, email, password, rol }) => {
      const exists = memoryStore.usuarios.findByEmail(email);
      if (exists) {
        const error = new Error("El email ya está registrado");
        error.statusCode = 409;
        throw error;
      }

      const newUser = {
        id: getNextId(usuarios),
        nombre,
        email,
        password,
        rol: rol || "usuario",
      };

      usuarios.push(newUser);
      const { password: _omit, ...safeUser } = newUser;
      return clone(safeUser);
    },
  },
  clientes: {
    list: () => clone(clientes),
    findById: (id) => clone(clientes.find((cliente) => cliente.id === Number(id)) || null),
    create: ({ nombre, email, telefono, direccion }) => {
      const nuevo = {
        id: getNextId(clientes),
        nombre,
        email,
        telefono,
        direccion,
      };
      clientes.push(nuevo);
      return clone(nuevo);
    },
    update: (id, payload) => {
      const index = clientes.findIndex((cliente) => cliente.id === Number(id));
      if (index === -1) return null;
      clientes[index] = { ...clientes[index], ...payload };
      return clone(clientes[index]);
    },
    remove: (id) => {
      const index = clientes.findIndex((cliente) => cliente.id === Number(id));
      if (index === -1) return false;
      clientes.splice(index, 1);
      return true;
    },
  },
  productos: {
    list: () => clone(productos),
    findById: (id) => clone(productos.find((producto) => producto.id === Number(id)) || null),
    create: ({ nombre, precio, stock, categoriaId }) => {
      const nuevo = {
        id: getNextId(productos),
        nombre,
        precio,
        stock,
        categoriaId,
      };
      productos.push(nuevo);
      return clone(nuevo);
    },
    update: (id, payload) => {
      const index = productos.findIndex((producto) => producto.id === Number(id));
      if (index === -1) return null;
      productos[index] = { ...productos[index], ...payload };
      return clone(productos[index]);
    },
    remove: (id) => {
      const index = productos.findIndex((producto) => producto.id === Number(id));
      if (index === -1) return false;
      productos.splice(index, 1);
      return true;
    },
  },
  facturas: {
    list: () =>
      clone(
        facturas.map((factura) => ({
          ...factura,
          cliente_nombre: clientes.find((c) => c.id === factura.cliente_id)?.nombre || "Cliente",
        }))
      ),
    findById: (id) => {
      const factura = facturas.find((item) => item.id === Number(id));
      if (!factura) return null;
      return clone({
        ...factura,
        cliente_nombre: clientes.find((c) => c.id === factura.cliente_id)?.nombre || "Cliente",
      });
    },
    create: ({ cliente_id, usuario_id, metodo, total, productos: productosFactura }) => {
      const nuevo = {
        id: getNextId(facturas),
        correlativo: facturas.length ? Math.max(...facturas.map((f) => f.correlativo)) + 1 : 1,
        cliente_id: Number(cliente_id),
        usuario_id: Number(usuario_id) || 1,
        metodo,
        total,
        productos: productosFactura,
        fecha: new Date().toISOString(),
      };
      facturas.push(nuevo);
      return clone(nuevo);
    },
  },
  dashboard: {
    summary: () => {
      const totalClientes = clientes.length;
      const totalProductos = productos.length;
      const totalFacturas = facturas.length;

      const ventasPorMetodo = facturas.reduce((acc, factura) => {
        if (!factura.metodo) return acc;
        acc[factura.metodo] = (acc[factura.metodo] || 0) + 1;
        return acc;
      }, {});

      const ventasPorCategoriaMap = new Map();

      facturas.forEach((factura) => {
        factura.productos.forEach((item) => {
          const product = productos.find((p) => p.id === item.id);
          if (!product) return;
          const categoriaNombre = categories.find((c) => c.id === product.categoriaId)?.nombre || "Sin categoría";
          const previo = ventasPorCategoriaMap.get(categoriaNombre) || 0;
          ventasPorCategoriaMap.set(categoriaNombre, previo + item.cantidad);
        });
      });

      const ventasPorCategoria = Array.from(ventasPorCategoriaMap.entries())
        .map(([categoria, total_vendido]) => ({ categoria, total_vendido }))
        .sort((a, b) => b.total_vendido - a.total_vendido)
        .slice(0, 4);

      const ultimasFacturas = facturas
        .slice()
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .slice(0, 5)
        .map((factura) => ({
          id: factura.id,
          cliente: clientes.find((c) => c.id === factura.cliente_id)?.nombre || "Cliente",
          total: factura.total,
          metodo: factura.metodo || "N/A",
          fecha: factura.fecha,
        }));

      return {
        totalClientes,
        totalProductos,
        totalFacturas,
        ventasPorCategoria,
        ventasPorMetodo: Object.entries(ventasPorMetodo).map(([metodo, total]) => ({
          metodo,
          total,
        })),
        ultimasFacturas,
      };
    },
  },
};

export default memoryStore;

