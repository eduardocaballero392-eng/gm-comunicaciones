// src/components/ClienteForm.jsx
import React, { useState, useEffect } from "react";
import "./ClienteForm.css"; // recuerda crear este CSS

export default function ClienteForm({ cliente, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
  });

  useEffect(() => {
    if (cliente) setFormData(cliente);
  }, [cliente]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>NOMBRE</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>EMAIL</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>TELÉFONO</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>DIRECCIÓN</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
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
