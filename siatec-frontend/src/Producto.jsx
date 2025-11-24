// src/Producto.jsx
import React, { useState, useEffect } from "react";
import ProductoForm from "./components/ProductoForm";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";
import "./Producto.css";

export default function Producto() {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Obtener productos desde backend
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiRequest("/productos"));
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Guardar producto (Agregar / Editar)
  const handleSave = async (producto) => {
    try {
      setError(null);
      if (producto.id) {
        await fetch(apiRequest(`/productos/${producto.id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        });
      } else {
        await fetch(apiRequest("/productos"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(producto),
        });
      }
      fetchProductos();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError("Error al guardar el producto");
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;
    try {
      setError(null);
      await fetch(apiRequest(`/productos/${id}`), { method: "DELETE" });
      fetchProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setError("Error al eliminar el producto");
    }
  };

  // Filtrar productos según búsqueda
  const productosFiltrados = productos.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="producto-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="producto-container">
      {/* Header */}
      <div className="producto-header">
        <div className="header-content">
          <div className="title-section">
            <h1>📦 Productos</h1>
            <p>Administra los productos de GM Comunicaciones</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="btn-back"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="toolbar">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto por nombre, precio, stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
        >
          <span className="btn-icon">➕</span>
          Nuevo Producto
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Tabla de productos */}
      <div className="table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>STOCK</th>
              <th>CATEGORÍA ID</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto, index) => (
              <tr key={producto.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="producto-name">{producto.nombre}</td>
                <td className="producto-precio">S/ {producto.precio}</td>
                <td className="producto-stock">{producto.stock}</td>
                <td className="producto-categoria">{producto.categoria_id || 'N/A'}</td>
                <td className="actions">
                  <button
                    onClick={() => { setEditing(producto); setShowForm(true); }}
                    className="btn-edit"
                    title="Editar producto"
                  >
                    <span>✏️</span>
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(producto.id)}
                    className="btn-delete"
                    title="Eliminar producto"
                  >
                    <span>🗑️</span>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {productosFiltrados.length === 0 && (
              <tr className="empty-row">
                <td colSpan="5" className="empty-state">
                  <div className="empty-content">
                    <span className="empty-icon">📦</span>
                    <p>No se encontraron productos</p>
                    <small>
                      {search ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer producto haciendo clic en "Nuevo Producto"'}
                    </small>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      <div className="stats-footer">
        <div className="stat-item">
          <span className="stat-number">{productos.length}</span>
          <span className="stat-label">TOTAL PRODUCTOS</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{productosFiltrados.length}</span>
          <span className="stat-label">MOSTRADOS</span>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <ProductoForm
          producto={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
