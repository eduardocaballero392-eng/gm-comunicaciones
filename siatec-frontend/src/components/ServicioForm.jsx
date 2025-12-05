// src/components/ServicioForm.jsx
import React, { useState, useEffect } from "react";
import "./ServicioForm.css";

export default function ServicioForm({ servicio, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
  });

  useEffect(() => {
    if (servicio) {
      setFormData({
        nombre: servicio.nombre || "",
        descripcion: servicio.descripcion || "",
        precio: servicio.precio || "",
        categoria: servicio.categoria || "",
      });
    }
  }, [servicio]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'precio' ? parseFloat(value) || 0 : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{servicio ? "Editar Servicio" : "Nuevo Servicio"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>NOMBRE DEL SERVICIO</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Agencia de Prensa y Relaciones Públicas"
              required
            />
          </div>

          <div className="form-group">
            <label>DESCRIPCIÓN</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe el servicio..."
              rows="4"
              required
            />
          </div>

          <div className="form-group">
            <label>PRECIO (S/)</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>CATEGORÍA</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: Relaciones Públicas, Marketing Digital, etc."
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-guardar">GUARDAR</button>
            <button type="button" className="btn-cancelar" onClick={onCancel}>
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

