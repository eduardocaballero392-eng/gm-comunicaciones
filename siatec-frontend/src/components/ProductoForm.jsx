// src/components/ProductoForm.jsx
import React, { useState, useEffect } from "react";
import "./ProductoForm.css";

export default function ProductoForm({ producto, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",   // 👈 cambiar "categoria" por "categoria_id"
  });

  useEffect(() => {
    if (producto) setFormData(producto);
  }, [producto]);

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
        <h2>{producto ? "Editar Producto" : "Nuevo Producto"}</h2>
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
            <label>PRECIO</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>STOCK</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>CATEGORÍA ID</label>
            <input
              type="number"
              name="categoria_id"
              value={formData.categoria_id}
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
