// src/Producto.jsx
import React, { useState, useEffect } from "react";
import ProductoForm from "./components/ProductoForm";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";

export default function Producto() {
  const [productos, setProductos] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔹 Obtener productos desde backend
  const fetchProductos = async () => {
    try {
      const res = await fetch(apiRequest("/productos"));
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // 🔹 Guardar producto (Agregar / Editar)
  const handleSave = async (producto) => {
    try {
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
    }
  };

  // 🔹 Eliminar producto
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await fetch(apiRequest(`/productos/${id}`), { method: "DELETE" });
      fetchProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
    }
  };

  // 🔹 Filtrar productos según búsqueda
  const productosFiltrados = productos.filter((p) =>
    Object.values(p)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      {/* Título + botón volver */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h1>Productos</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#818cf8",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          ← Volver al Dashboard
        </button>
      </div>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="🔍 Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: "1rem",
          padding: "0.6rem 1rem",
          width: "100%",
          maxWidth: "350px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />

      <button
        onClick={() => setShowForm(true)}
        style={{
          marginBottom: "1rem",
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
        }}
      >
        Nuevo Producto
      </button>

      {/* Formulario modal */}
      {showForm && (
        <ProductoForm
          producto={editing}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      {/* Tabla de productos */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "0.8rem" }}>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría ID</th> {/* ✅ corregido */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem" }}>{p.nombre}</td>
                <td>{p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.categoria_id}</td> {/* ✅ corregido */}
                <td>
                  <button
                    onClick={() => {
                      setEditing(p);
                      setShowForm(true);
                    }}
                    style={{
                      marginRight: "0.3rem",
                      padding: "0.3rem 0.6rem",
                      backgroundColor: "#facc15",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      padding: "0.3rem 0.6rem",
                      backgroundColor: "#f87171",
                      border: "none",
                      borderRadius: "4px",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron productos
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
