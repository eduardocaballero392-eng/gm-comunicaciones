// src/Clientes.jsx
import React, { useState, useEffect } from "react";
import ClienteForm from "./components/ClienteForm";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState(""); // 🔹 estado para buscador
  const navigate = useNavigate();

  // 🔹 Obtener clientes desde backend
  const fetchClientes = async () => {
    try {
      const res = await fetch(apiRequest("/clientes"));
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // 🔹 Guardar cliente (Agregar / Editar)
  const handleSave = async (cliente) => {
    try {
      if (cliente.id) {
        await fetch(apiRequest(`/clientes/${cliente.id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      } else {
        await fetch(apiRequest("/clientes"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      }
      fetchClientes();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Error al guardar cliente:", err);
    }
  };

  // 🔹 Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este cliente?")) return;
    try {
      await fetch(apiRequest(`/clientes/${id}`), { method: "DELETE" });
      fetchClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
    }
  };

  // 🔹 Filtrar clientes según búsqueda
  const clientesFiltrados = clientes.filter((c) =>
    Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Clientes</h1>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "0.5rem 1rem", backgroundColor: "#818cf8", color: "white", border: "none", borderRadius: "6px" }}>
          ← Volver al Dashboard
        </button>
      </div>

      {/* 🔍 Buscador */}
      <input
        type="text"
        placeholder="🔍Buscar cliente..."
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

      <button onClick={() => setShowForm(true)} style={{ marginBottom: "1rem", marginLeft: "1rem", padding: "0.5rem 1rem", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px" }}>
        Nuevo Cliente
      </button>

      {showForm && (
        <ClienteForm
          cliente={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ padding: "0.8rem" }}>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem" }}>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion}</td>
              <td>
                <button
                  onClick={() => { setEditing(c); setShowForm(true); }}
                  style={{ marginRight: "0.3rem", padding: "0.3rem 0.6rem", backgroundColor: "#facc15", border: "none", borderRadius: "4px" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  style={{ padding: "0.3rem 0.6rem", backgroundColor: "#f87171", border: "none", borderRadius: "4px" }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {clientesFiltrados.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron clientes
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
