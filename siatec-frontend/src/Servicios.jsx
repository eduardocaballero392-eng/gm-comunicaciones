// src/Servicios.jsx
import React, { useState, useEffect } from "react";
import ServicioForm from "./components/ServicioForm";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "./config";
import "./Servicios.css";

export default function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Datos de ejemplo de servicios
  const serviciosEjemplo = [
    { id: 1, nombre: "Agencia de Prensa y Relaciones Públicas", precio: 2500.00, descripcion: "Servicios completos de relaciones públicas y gestión de prensa" },
    { id: 2, nombre: "Media Training", precio: 1800.00, descripcion: "Capacitación para portavoces y ejecutivos en medios de comunicación" },
    { id: 3, nombre: "Creatividad Gráfica", precio: 1200.00, descripcion: "Diseño gráfico y creatividad visual para campañas" },
    { id: 4, nombre: "Community Manager", precio: 1500.00, descripcion: "Gestión de redes sociales y comunidades digitales" },
    { id: 5, nombre: "Monitoreo de Medios", precio: 900.00, descripcion: "Seguimiento y análisis de menciones en medios" },
    { id: 6, nombre: "Diseño Web", precio: 2000.00, descripcion: "Diseño y desarrollo de sitios web corporativos" },
    { id: 7, nombre: "Marketing de Contenidos", precio: 1600.00, descripcion: "Creación y estrategia de contenido para marketing digital" },
  ];

  // Obtener servicios desde backend o usar datos de ejemplo
  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(apiRequest("/servicios"));
      if (!res.ok) throw new Error("Error en la respuesta del servidor");
      const data = await res.json();
      // Si hay datos del backend, usarlos; si no, usar datos de ejemplo
      setServicios(data && data.length > 0 ? data : serviciosEjemplo);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      // Si falla el backend, usar datos de ejemplo
      setServicios(serviciosEjemplo);
      setError(null); // No mostrar error, usar datos de ejemplo
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  // Guardar servicio (Agregar / Editar)
  const handleSave = async (servicioData) => {
    try {
      setError(null);
      // Si hay servicios de ejemplo, agregar el nuevo a la lista local
      if (servicios.length > 0 && servicios[0].id <= 7) {
        // Estamos usando datos de ejemplo
        if (editing) {
          // Editar servicio existente
          const updated = servicios.map(s => 
            s.id === editing.id ? { ...s, ...servicioData } : s
          );
          setServicios(updated);
        } else {
          // Agregar nuevo servicio
          const nuevoServicio = {
            id: Math.max(...servicios.map(s => s.id)) + 1,
            ...servicioData,
            stock: 999 // Servicios siempre disponibles
          };
          setServicios([...servicios, nuevoServicio]);
        }
        setShowForm(false);
        setEditing(null);
        return;
      }

      // Intentar guardar en el backend
      if (editing && editing.id) {
        await fetch(apiRequest(`/servicios/${editing.id}`), {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(servicioData),
        });
      } else {
        await fetch(apiRequest("/servicios"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(servicioData),
        });
      }
      fetchServicios();
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      // Si falla el backend, guardar localmente
      if (editing && editing.id) {
        const updated = servicios.map(s => 
          s.id === editing.id ? { ...s, ...servicioData } : s
        );
        setServicios(updated);
      } else {
        const nuevoServicio = {
          id: servicios.length > 0 ? Math.max(...servicios.map(s => s.id)) + 1 : 8,
          ...servicioData,
          stock: 999
        };
        setServicios([...servicios, nuevoServicio]);
      }
      setShowForm(false);
      setEditing(null);
    }
  };

  // Eliminar servicio
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este servicio?")) return;
    try {
      setError(null);
      await fetch(apiRequest(`/servicios/${id}`), { method: "DELETE" });
      fetchServicios();
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      // Si falla el backend, eliminar del estado local
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  // Filtrar servicios según búsqueda
  const serviciosFiltrados = servicios.filter((s) =>
    Object.values(s)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="servicios-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
            <p>Cargando  servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="servicios-container">
      {/* Header */}
      <div className="servicios-header">
        <div className="header-content">
          <div className="title-section">
            <h1>  Servicios</h1>
            <p>Administra los  servicios de GM Comunicaciones</p>
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
            placeholder="Buscar  servicios por nombre, precio, descripcion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn-primary"
        >
          <span className="btn-icon"></span>
          Nuevo Servicio
        </button>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

                                                        {/* Tabla de  servicios */}
      <div className="table-container">
        <table className="servicios-table">
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>DESCRIPCION</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
                    {serviciosFiltrados.map((servicio, index) => (
              <tr key={servicio.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className="servicio-name">{servicio.nombre}</td>
                <td className="servicio-precio">S/ {servicio.precio?.toFixed(2) || '0.00'}</td>
                <td className="servicio-descripcion">{servicio.descripcion}</td>
                <td className="actions">
                  <button
                    onClick={() => { setEditing(servicio); setShowForm(true); }}
                    className="btn-edit"
                    title="Editar servicio"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(servicio.id)}
                    className="btn-delete"
                    title="Eliminar servicio"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {serviciosFiltrados.length === 0 && (
              <tr className="empty-row">
                <td colSpan="4" className="empty-state">
                  <div className="empty-content">
                    <span className="empty-icon">🎯</span>
                    <p>No se encontraron servicios</p>
                    <small>
                      {search ? 'Intenta con otros términos de búsqueda' : 'Agrega tu primer servicio haciendo clic en "Nuevo Servicio"'}
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
          <span className="stat-number">{servicios.length}</span>
                    <span className="stat-label">TOTAL  SERVICIOS</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{serviciosFiltrados.length}</span>
          <span className="stat-label">MOSTRADOS</span>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <ServicioForm
          servicio={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
