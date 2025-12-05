// src/Clientes.jsx
import React, { useState, useEffect } from "react";
import ClienteForm from "./components/ClienteForm";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";
import "./components/ClienteForm.css"; 
export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Paleta de colores GM Comunicaciones
  const colors = {
    primary: "#1a3e6d",
    secondary: "#e74c3c",
    success: "#27ae60",
    warning: "#f39c12",
    background: "#f8f9fa",
    text: "#333333",
    border: "#e5e7eb"
  };

  // Obtener clientes desde backend
  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiRequest("/clientes"));
      if (!res.ok) throw new Error("Error al cargar clientes");
      const data = await res.json();
      setClientes(data);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Guardar cliente (Agregar / Editar)
  const handleSave = async (cliente) => {
    try {
      setError(null);
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
      setError("Error al guardar el cliente");
    }
  };

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) return;
    try {
      setError(null);
      await fetch(apiRequest(`/clientes/${id}`), { method: "DELETE" });
      fetchClientes();
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setError("Error al eliminar el cliente");
    }
  };

  // Filtrar clientes según búsqueda
  const clientesFiltrados = clientes.filter((c) =>
    Object.values(c)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="clientes-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clientes-container">
      {/* Header */}
      <div className="clientes-header">
        <div className="header-content">
          <div className="title-section">
            <h1> Gestión de Clientes</h1>
            <p>Administra los clientes de GM Comunicaciones</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")} 
            className="btn-back"
          >
          Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div className="toolbar">
        <div className="search-container">
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Buscar cliente por nombre, email, teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
        >
         
          Nuevo Cliente
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Tabla de clientes */}
      <div className="table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente, index) => (
              <tr key={cliente.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="cliente-name">
                  <span className="name-avatar">
                    {cliente.nombre?.charAt(0).toUpperCase() || 'C'}
                  </span>
                  {cliente.nombre}
                </td>
                <td className="cliente-email">{cliente.email}</td>
                <td className="cliente-phone">{cliente.telefono || 'N/A'}</td>
                <td className="cliente-address">{cliente.direccion || 'N/A'}</td>
                <td className="actions">
                  <button
                    onClick={() => { setEditing(cliente); setShowForm(true); }}
                    className="btn-edit"
                    title="Editar cliente"
                  >
    
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cliente.id)}
                    className="btn-delete"
                    title="Eliminar cliente"
                  >
                    
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {clientesFiltrados.length === 0 && (
              <tr className="empty-row">
                <td colSpan="5" className="empty-state">
                  <div className="empty-content">
                    <span className="empty-icon">👥</span>
                    <p>No se encontraron clientes</p>
                    <small>
                      {search ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer cliente haciendo clic en "Nuevo Cliente"'}
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
          <span className="stat-number">{clientes.length}</span>
          <span className="stat-label">Total Clientes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{clientesFiltrados.length}</span>
          <span className="stat-label">Mostrados</span>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <ClienteForm
          cliente={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}