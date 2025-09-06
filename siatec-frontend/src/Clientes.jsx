// src/Clientes.jsx
import React, { useState, useEffect } from "react";
import ClienteForm from "./components/ClienteForm";
import { useNavigate } from "react-router-dom";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // 🔹 Obtener clientes desde backend
  const fetchClientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/clientes");
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
        // Editar
        await fetch(`http://localhost:3001/clientes/${cliente.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cliente),
        });
      } else {
        // Agregar
        await fetch("http://localhost:3001/clientes", {
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
      await fetch(`http://localhost:3001/clientes/${id}`, { method: "DELETE" });
      fetchClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1>Clientes</h1>
        <button onClick={() => navigate("/dashboard")} style={{ padding: "0.5rem 1rem", backgroundColor: "#818cf8", color: "white", border: "none", borderRadius: "6px" }}>
          ← Volver al Dashboard
        </button>
      </div>

      <button onClick={() => setShowForm(true)} style={{ marginBottom: "1rem", padding: "0.5rem 1rem", backgroundColor: "#4f46e5", color: "white", border: "none", borderRadius: "6px" }}>
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
          <tr style={{ backgroundColor: "#e0e7ff" }}>
            <th style={{ padding: "0.8rem" }}>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem" }}>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.telefono}</td>
              <td>{c.direccion}</td>
              <td>
                <button onClick={() => { setEditing(c); setShowForm(true); }} style={{ marginRight: "0.3rem", padding: "0.3rem 0.6rem", backgroundColor: "#facc15", border: "none", borderRadius: "4px" }}>Editar</button>
                <button onClick={() => handleDelete(c.id)} style={{ padding: "0.3rem 0.6rem", backgroundColor: "#f87171", border: "none", borderRadius: "4px" }}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
