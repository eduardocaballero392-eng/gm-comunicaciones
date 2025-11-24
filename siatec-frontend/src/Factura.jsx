// src/Factura.jsx
import React, { useState, useEffect } from "react";
import "./Factura.css";
import { FaTrash, FaPrint, FaArrowLeft, FaSave, FaSearch, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";

export default function Factura() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientesRes, productosRes] = await Promise.all([
          fetch(apiRequest("/clientes")),
          fetch(apiRequest("/productos"))
        ]);
        
        const clientesData = await clientesRes.json();
        const productosData = await productosRes.json();
        
        setClientes(clientesData);
        setProductos(productosData);
      } catch (err) {
        console.error("Error cargando datos:", err);
        alert("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agregarProducto = (p) => {
    const cantidad = cantidades[p.id] || 1;
    if (!cantidad || cantidad <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }
    
    if (cantidad > p.stock) {
      alert(`❌ Stock insuficiente. Disponible: ${p.stock} unidades`);
      return;
    }

    const existente = carrito.find((item) => item.id === p.id);
    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidad;
      if (nuevaCantidad > p.stock) {
        alert(`❌ No puedes agregar más de ${p.stock} unidades`);
        return;
      }
      setCarrito(
        carrito.map((item) =>
          item.id === p.id ? { ...item, cantidad: nuevaCantidad } : item
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

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const producto = productos.find(p => p.id === id);
    if (nuevaCantidad > producto.stock) {
      alert(`❌ Máximo disponible: ${producto.stock} unidades`);
      return;
    }
    
    setCarrito(carrito.map(item =>
      item.id === id ? { ...item, cantidad: nuevaCantidad } : item
    ));
  };

  const guardarFactura = async () => {
    if (!cliente) {
      alert("👤 Seleccione un cliente para continuar");
      return;
    }

    if (carrito.length === 0) {
      alert("🛒 Agregue productos a la factura");
      return;
    }

    const facturaData = {
      cliente_id: parseInt(cliente),
      metodo: metodoPago,
      total: total,
      carrito: carrito.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio: item.precio
      }))
    };

    try {
      const response = await fetch(apiRequest("/facturas"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(facturaData),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(`✅ Factura #${result.facturaId} guardada correctamente`);
        navigate(`/factura/${result.facturaId}`);
        
        // Limpiar formulario
        setCarrito([]);
        setCliente("");
        setMetodoPago("Efectivo");
        setCantidades({});
      } else {
        alert("❌ Error: " + (result.error || "No se pudo guardar la factura"));
      }
    } catch (error) {
      console.error("Error al guardar factura:", error);
      alert("❌ Error de conexión con el servidor");
    }
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const clienteSeleccionado = clientes.find(c => c.id === parseInt(cliente));

  const imprimirFactura = () => {
    if (carrito.length === 0) {
      alert("No hay productos para imprimir");
      return;
    }
    window.print();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="factura-container">
      {/* Header */}
      <div className="factura-header">
        <button className="btn-regresar" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Volver al Dashboard
        </button>
        <div className="header-content">
          <h1>🧾 Nueva Factura</h1>
          <p>GM Comunicaciones Agencia de Relaciones Públicas</p>
        </div>
      </div>

      <div className="factura-grid">
        {/* Columna Izquierda - Productos */}
        <div className="factura-col izquierda">
          {/* Panel de Control */}
          <div className="control-panel">
            <div className="form-group">
              <label>👤 Cliente</label>
              <select
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                className="input-select"
              >
                <option value="">Seleccione un cliente...</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} - {c.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>💳 Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="input-select"
              >
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Tarjeta">💳 Tarjeta</option>
                <option value="Transferencia">🏦 Transferencia</option>
                <option value="Yape">📱 Yape</option>
                <option value="Plin">📱 Plin</option>
              </select>
            </div>

            <div className="panel-actions">
              <button className="btn-guardar" onClick={guardarFactura}>
                <FaSave /> Guardar Factura
              </button>
              <button className="btn-imprimir" onClick={imprimirFactura}>
                <FaPrint /> Imprimir
              </button>
            </div>
          </div>

          {/* Búsqueda de Productos */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </div>

          {/* Lista de Productos */}
          <div className="productos-section">
            <h3>📦 Productos Disponibles</h3>
            <div className="productos-grid">
              {productos
                .filter((p) =>
                  p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((p) => (
                  <div key={p.id} className="producto-card">
                    <div className="producto-info">
                      <h4>{p.nombre}</h4>
                      <p className="producto-precio">S/ {p.precio}</p>
                      <p className="producto-stock">
                        Stock: <span className={p.stock > 0 ? "stock-disponible" : "stock-agotado"}>
                          {p.stock} unidades
                        </span>
                      </p>
                    </div>
                    <div className="producto-actions">
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
                        disabled={p.stock <= 0}
                      />
                      <button
                        className="btn-agregar"
                        onClick={() => agregarProducto(p)}
                        disabled={p.stock <= 0}
                      >
                        ➕ Agregar
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Carrito */}
        <div className="factura-col derecha">
          <div className="carrito-header">
            <h2>🛒 Carrito de Compra</h2>
            {clienteSeleccionado && (
              <div className="cliente-info">
                <strong>Cliente:</strong> {clienteSeleccionado.nombre}
              </div>
            )}
          </div>

          {carrito.length === 0 ? (
            <div className="empty-cart">
              <FaShoppingCart size={48} />
              <p>El carrito está vacío</p>
              <small>Agrega productos desde la lista de la izquierda</small>
            </div>
          ) : (
            <>
              <div className="carrito-items">
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    <div className="item-info">
                      <h4>{item.nombre}</h4>
                      <p>S/ {item.precio} c/u</p>
                    </div>
                    <div className="item-controls">
                      <div className="cantidad-controls">
                        <button 
                          onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button 
                          onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <p className="item-subtotal">
                        S/ {(item.precio * item.cantidad).toFixed(2)}
                      </p>
                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarProducto(item.id)}
                        title="Eliminar producto"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="carrito-total">
                <div className="total-line">
                  <span>Subtotal:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>IGV (18%):</span>
                  <span>S/ {(total * 0.18).toFixed(2)}</span>
                </div>
                <div className="total-line final">
                  <span>Total a Pagar:</span>
                  <span>S/ {(total * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}