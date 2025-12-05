// src/components/FacturaDetalle.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPrint, FaFileInvoice, FaCalendarAlt, FaUser, FaCreditCard, FaBuilding } from "react-icons/fa";
import "./facturaDetalle.css";
import { apiRequest } from "../config";

export default function FacturaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [factura, setFactura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [facturas, setFacturas] = useState([]);

  // Si no hay id, mostrar lista de facturas
  useEffect(() => {
    if (!id) {
      // Cargar lista de facturas
      fetch(apiRequest("/facturas"))
        .then((res) => res.json())
        .then((data) => {
          setFacturas(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando facturas:", err);
          setFacturas([]);
          setLoading(false);
        });
    } else {
      // Cargar factura específica
      fetch(apiRequest(`/facturas/${id}`))
        .then((res) => res.json())
        .then((data) => {
          setFactura(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error cargando factura:", err);
          setLoading(false);
        });
    }
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="factura-detalle-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay id, mostrar lista de facturas
  if (!id) {
    return (
      <div className="factura-detalle-container">
        <div className="factura-header-section">
          <div className="header-content">
            <div className="title-section">
              <h1>
                <FaFileInvoice /> Detalle de Facturas
              </h1>
              <p>Gestión completa de facturas de GM Comunicaciones</p>
            </div>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="btn-back"
            >
               Volver al Dashboard
            </button>
          </div>
        </div>

        <div className="facturas-list-container">
          {facturas.length === 0 ? (
            <div className="empty-state">
              <FaFileInvoice size={48} />
              <p>No hay facturas registradas</p>
              <small>Las facturas aparecerán aquí cuando las crees</small>
              <button 
                onClick={() => navigate("/factura")} 
                className="btn-primary"
              >
                Crear Nueva Factura
              </button>
            </div>
          ) : (
            <div className="facturas-grid">
              {facturas.map((fact) => (
                <div 
                  key={fact.id} 
                  className="factura-card"
                  onClick={() => navigate(`/factura/${fact.id}`)}
                >
                  <div className="factura-card-header">
                    <span className="factura-id">#{fact.id}</span>
                    <span className="factura-total">{formatCurrency(fact.total || 0)}</span>
                  </div>
                  <div className="factura-card-body">
                    <p className="factura-cliente">
                      <FaUser /> {fact.cliente_nombre || 'Cliente'}
                    </p>
                    <p className="factura-fecha">
                      <FaCalendarAlt /> {formatDate(fact.fecha || new Date())}
                    </p>
                    <p className="factura-metodo">
                      <FaCreditCard /> {fact.metodo || 'N/A'}
                    </p>
                  </div>
                  <div className="factura-card-footer">
                    <button 
                      className="btn-ver-detalle"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/factura/${fact.id}`);
                      }}
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar detalle de factura específica
  if (!factura) {
    return (
      <div className="factura-detalle-container">
        <div className="error-state">
          <p>No se pudo cargar la factura</p>
          <button onClick={() => navigate("/facturas")} className="btn-back">
            <FaArrowLeft /> Volver a Facturas
          </button>
        </div>
      </div>
    );
  }

  const subtotal = factura.total || 0;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  return (
    <div className="factura-detalle-container">
      <div className="factura-header-section">
        <div className="header-content">
          <div className="title-section">
            <h1>
              <FaFileInvoice /> Factura #{factura.id}
            </h1>
            <p>GM Comunicaciones - Agencia de Relaciones Públicas</p>
          </div>
          <div className="header-actions">
            <button onClick={() => navigate("/facturas")} className="btn-back">
              <FaArrowLeft /> Volver
            </button>
            <button className="btn-print" onClick={() => window.print()}>
              <FaPrint /> Imprimir
            </button>
          </div>
        </div>
      </div>

      <div className="factura-content">
        {/* Información de la empresa */}
        <div className="empresa-info">
          <div className="empresa-logo">
            <FaBuilding size={48} />
          </div>
          <div className="empresa-details">
            <h2>GM Comunicaciones</h2>
            <p>Agencia de Relaciones Públicas</p>
            <p>RUC: 20123456789</p>
            <p>Lima, Perú</p>
          </div>
        </div>

        {/* Información del cliente y factura */}
        <div className="factura-info-grid">
          <div className="info-card">
            <h3><FaUser /> Información del Cliente</h3>
            <p><strong>Nombre:</strong> {factura.cliente_nombre || factura.cliente_id || 'N/A'}</p>
            <p><strong>ID Cliente:</strong> {factura.cliente_id || 'N/A'}</p>
          </div>
          <div className="info-card">
            <h3><FaFileInvoice /> Información de la Factura</h3>
            <p><strong>Número:</strong> #{factura.id}</p>
            <p><strong>Fecha:</strong> {formatDate(factura.fecha || new Date())}</p>
            <p><strong>Método de Pago:</strong> {factura.metodo || 'N/A'}</p>
          </div>
        </div>

        {/* Tabla de servicios */}
        <div className="servicios-section">
          <h3>Servicios Contratados</h3>
          <div className="table-wrapper">
            <table className="servicios-table">
              <thead>
                <tr>
                  <th>SERVICIO</th>
                  <th>CANTIDAD</th>
                  <th>PRECIO UNITARIO</th>
                  <th>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {(factura.productos || factura.servicios || []).length > 0 ? (
                  (factura.productos || factura.servicios || []).map((servicio, i) => (
                    <tr key={i}>
                      <td className="servicio-name">{servicio.nombre || 'Servicio'}</td>
                      <td className="servicio-cantidad">{servicio.cantidad || 1}</td>
                      <td className="servicio-precio">{formatCurrency(servicio.precio || 0)}</td>
                      <td className="servicio-subtotal">
                        {formatCurrency((servicio.precio || 0) * (servicio.cantidad || 1))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-services">
                      No hay servicios registrados en esta factura
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totales */}
        <div className="totales-section">
          <div className="totales-card">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="total-line">
              <span>IGV (18%):</span>
              <span>{formatCurrency(igv)}</span>
            </div>
            <div className="total-line final">
              <span>Total a Pagar:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Notas y términos */}
        <div className="notas-section">
          <h3>Notas y Términos</h3>
          <p>• Esta factura es válida para efectos tributarios según la normativa vigente.</p>
          <p>• El pago debe realizarse dentro de los plazos establecidos en el contrato.</p>
          <p>• Para consultas, contactar a GM Comunicaciones.</p>
        </div>
      </div>
    </div>
  );
}
