// src/components/FacturaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint } from "react-icons/fa";
import "./facturaDetalle.css";

export default function FacturaDetalle() {
  const { id } = useParams(); // id de la URL
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/facturas/${id}`)
      .then((res) => res.json())
      .then((data) => setFactura(data))
      .catch((err) => console.error("Error cargando factura:", err));
  }, [id]);

  if (!factura) return <p>Cargando factura...</p>;

  return (
    <div className="factura-detalle">
      <button className="btn-volver" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Volver
      </button>

      <h1>Factura #{factura.id}</h1>
      <p><strong>Cliente:</strong> {factura.cliente_nombre || factura.cliente_id}</p>
      <p><strong>Método de pago:</strong> {factura.metodo}</p>
      <p><strong>Fecha:</strong> {new Date(factura.fecha).toLocaleString()}</p>

      <h2>Productos</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {factura.productos.map((p, i) => (
            <tr key={i}>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>S/ {p.precio}</td>
              <td>S/ {p.precio * p.cantidad}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total:
            </td>
            <td style={{ fontWeight: "bold" }}>S/ {factura.total}</td>
          </tr>
        </tbody>
      </table>

      <button className="btn-imprimir" onClick={() => window.print()}>
        <FaPrint /> Imprimir
      </button>
    </div>
  );
}
