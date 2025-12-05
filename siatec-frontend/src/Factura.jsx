// src/Factura.jsx
import React, { useState, useEffect } from "react";
import "./Factura.css";
import { FaTrash, FaPrint, FaArrowLeft, FaSave, FaSearch, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";

export default function Factura() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [busqueda, setBusqueda] = useState("");
  const [cantidades, setCantidades] = useState({});
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(true);

  // Servicios disponibles de GM Comunicaciones
  const serviciosDisponibles = [
    { id: 1, nombre: "Agencia de Prensa y Relaciones Públicas", precio: 2500.00, stock: 999 },
    { id: 2, nombre: "Media Training", precio: 1800.00, stock: 999 },
    { id: 3, nombre: "Creatividad Gráfica", precio: 1200.00, stock: 999 },
    { id: 4, nombre: "Community Manager", precio: 1500.00, stock: 999 },
    { id: 5, nombre: "Monitoreo de Medios", precio: 900.00, stock: 999 },
    { id: 6, nombre: "Diseño Web", precio: 2000.00, stock: 999 },
    { id: 7, nombre: "Marketing de Contenidos", precio: 1600.00, stock: 999 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const clientesRes = await fetch(apiRequest("/clientes"));
        const clientesData = await clientesRes.json();
        
        setClientes(clientesData);
        // Usar servicios disponibles en lugar de productos
        setServicios(serviciosDisponibles);
      } catch (err) {
        console.error("Error cargando datos:", err);
        // Si falla el backend, usar servicios de ejemplo
        setServicios(serviciosDisponibles);
        alert("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const agregarServicio = (s) => {
    const cantidad = cantidades[s.id] || 1;
    if (!cantidad || cantidad <= 0) {
      alert("Ingrese una cantidad válida");
      return;
    }
    
    if (cantidad > s.stock) {
      alert(`❌ Stock insuficiente. Disponible: ${s.stock} unidades`);
      return;
    }

    const existente = carrito.find((item) => item.id === s.id);
    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidad;
      if (nuevaCantidad > s.stock) {
        alert(`❌ No puedes agregar más de ${s.stock} unidades`);
        return;
      }
      setCarrito(
        carrito.map((item) =>
          item.id === s.id ? { ...item, cantidad: nuevaCantidad } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...s, cantidad }]);
    }

    setCantidades({ ...cantidades, [s.id]: 1 });
  };

  const eliminarServicio = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    
    const servicio = servicios.find(s => s.id === id);
    if (nuevaCantidad > servicio.stock) {
      alert(`❌ Máximo disponible: ${servicio.stock} unidades`);
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
      alert("🛒 Agregue servicios a la factura");
      return;
    }

    const facturaData = {
      cliente_id: parseInt(cliente),
      metodo: metodoPago,
      total: total,
      carrito: carrito.map(item => ({
        producto_id: item.id,
        nombre: item.nombre, // Incluir el nombre del servicio
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
        alert(`Factura #${result.facturaId} guardada correctamente`);
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
      alert("No hay servicios para imprimir");
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
         Volver al Dashboard
        </button>
        <div className="header-content">
          <h1>Nueva Factura</h1>
          <p>GM Comunicaciones Agencia de Relaciones Públicas</p>
        </div>
      </div>

      <div className="factura-grid">
        {/* Columna Izquierda - Servicios */}
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

          {/* Búsqueda de Servicios */}
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar servicios por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input-busqueda"
            />
          </div>

          {/* Lista de Servicios */}
          <div className="productos-section">
            <h3>Servicios Disponibles</h3>
            <div className="productos-grid">
              {servicios
                .filter((s) =>
                  s.nombre.toLowerCase().includes(busqueda.toLowerCase())
                )
                .map((s) => (
                  <div key={s.id} className="producto-card">
                    <div className="producto-info">
                      <h4>{s.nombre}</h4>
                      <p className="producto-precio">S/ {s.precio.toFixed(2)}</p>
                      <p className="producto-stock">
                        Disponible: <span className={s.stock > 0 ? "stock-disponible" : "stock-agotado"}>
                          {s.stock > 0 ? "Sí" : "No"}
                        </span>
                      </p>
                    </div>
                    <div className="producto-actions">
                      <input
                        type="number"
                        min="1"
                        max={s.stock}
                        value={cantidades[s.id] || 1}
                        onChange={(e) =>
                          setCantidades({
                            ...cantidades,
                            [s.id]: parseInt(e.target.value) || 1,
                          })
                        }
                        className="input-cantidad"
                        disabled={s.stock <= 0}
                      />
                      <button
                        className="btn-agregar"
                        onClick={() => agregarServicio(s)}
                        disabled={s.stock <= 0}
                      >
                         Agregar
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
              <small>Agrega servicios desde la lista de la izquierda</small>
            </div>
          ) : (
            <>
              <div className="carrito-items">
                {carrito.map((item) => (
                  <div key={item.id} className="carrito-item">
                    <div className="item-info">
                      <h4>{item.nombre}</h4>
                      <p>S/ {item.precio.toFixed(2)} c/u</p>
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
                        onClick={() => eliminarServicio(item.id)}
                        title="Eliminar servicio"
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