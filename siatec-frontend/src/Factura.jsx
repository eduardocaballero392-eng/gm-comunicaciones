// src/Factura.jsx
import React, { useState, useEffect } from "react";
import "./factura.css";
import { FaTrash, FaPrint, FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Factura() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/clientes")
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((err) => console.error("Error cargando clientes:", err));

    fetch("http://localhost:3001/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  const agregarProducto = (p) => {
    const cantidad = cantidades[p.id] || 1;
    if (!cantidad || cantidad <= 0) return;
    if (cantidad > p.stock) {
      alert(`No hay suficiente stock. Solo quedan ${p.stock} unidades.`);
      return;
    }

    const existente = carrito.find((item) => item.id === p.id);
    if (existente) {
      setCarrito(
        carrito.map((item) =>
          item.id === p.id ? { ...item, cantidad: item.cantidad + cantidad } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...p, cantidad }]);
    }

    setCantidades({ ...cantidades, [p.id]: 1 });
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const guardarFactura = async () => {
    if (!cliente) {
      alert("Seleccione un cliente");
      return;
    }

    if (carrito.length === 0) {
      alert("Agregue productos a la factura");
      return;
    }

    const facturaData = {
      cliente_id: parseInt(cliente),
      metodo: metodoPago,
      total: total,
      carrito: carrito
    };

    try {
      const response = await fetch("http://localhost:3001/facturas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facturaData),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ Factura guardada correctamente - ID: ${result.facturaId}`);
        // Limpiar carrito y selecciones
        setCarrito([]);
        setCliente("");
        setMetodoPago("Efectivo");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error al guardar factura:", error);
      alert("Error al conectar con el servidor");
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const imprimirFactura = () => {
    window.print();
  };

  return (
    <div className="factura-container">
      <button className="btn-regresar" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Regresar
      </button>

      <h1>Nueva Factura</h1>

      <div className="factura-grid">
        <div className="factura-col izquierda">
          <div className="factura-datos">
            <select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
              className="input-corto"
            >
              <option value="">Seleccione cliente</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="input-corto"
            >
              <option value="Efectivo">Efectivo</option>
              <option value="Tarjeta">Tarjeta</option>
              <option value="Transferencia">Transferencia</option>
              <option value="Yape">Yape</option>
              <option value="Plin">Plin</option>
            </select>

            <button className="btn-guardar" onClick={guardarFactura}>
              <FaSave /> Guardar
            </button>
            
            <button className="btn-imprimir" onClick={imprimirFactura}>
              <FaPrint /> Imprimir
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda"
          />

          <table className="tabla-productos">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Cant.</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productos
                .filter((p) =>
                  p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>S/ {p.precio}</td>
                    <td>{p.stock}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max={p.stock}
                        value={cantidades[p.id] || 1}
                        onChange={(e) =>
                          setCantidades({
                            ...cantidades,
                            [p.id]: parseInt(e.target.value) || 1,
                          })
                        }
                        className="input-cantidad"
                      />
                    </td>
                    <td>
                      <button
                        className="btn-agregar"
                        onClick={() => agregarProducto(p)}
                        disabled={p.stock <= 0}
                      >
                        Agregar
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="factura-col derecha">
          <h2>Factura</h2>
          {carrito.length === 0 ? (
            <p>No hay productos agregados.</p>
          ) : (
            <table className="tabla-carrito">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.id}>
                    <td>{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>S/ {item.precio}</td>
                    <td>S/ {item.precio * item.cantidad}</td>
                    <td>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarProducto(item.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
                    Total:
                  </td>
                  <td colSpan="2" style={{ fontWeight: "bold", textAlign: "center" }}>
                    S/ {total}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}