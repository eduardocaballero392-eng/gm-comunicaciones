import React, { useEffect, useState } from "react";
import "./dashboard.css";
import Sidebar from "./components/Sidebar";
import { apiRequest } from "./config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = ({ onLogout }) => {
  const [data, setData] = useState({
    totalClientes: 0,
    totalServicios: 7, // Datos de ejemplo basados en los servicios disponibles
    totalFacturas: 0,
    ventasPorCategoria: [],
    ventasPorMetodo: [],
    ultimasFacturas: [],
  });

  // Datos de ejemplo para Servicios Más Vendidos (basados en servicios reales) - Solo top 5
  const serviciosMasVendidos = [
    { servicio: "Agencia de Prensa y Relaciones Públicas", total: 12500.00 },
    { servicio: "Diseño Web", total: 8000.00 },
    { servicio: "Marketing de Contenidos", total: 6400.00 },
    { servicio: "Media Training", total: 5400.00 },
    { servicio: "Community Manager", total: 4500.00 },
  ];

  // Datos de ejemplo para Estados de Cotizaciones - CORREGIDO
  const estadosCotizaciones = [
    { estado: "Pendientes", cantidad: 2, porcentaje: 33 },    // 2/6 = 33%
    { estado: "Aprobadas", cantidad: 1, porcentaje: 17 },     // 1/6 = 17%
    { estado: "Rechazadas", cantidad: 1, porcentaje: 17 },    // 1/6 = 17%
    { estado: "Completadas", cantidad: 2, porcentaje: 33 },   // 2/6 = 33%
  ];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('cotizaciones'); // 'cotizaciones' o 'proyectos'

  // Paleta de colores corporativa GM Comunicaciones
  const COLORS = {
    primary: "#1a3e6d",      // Azul corporativo
    secondary: "#e74c3c",    // Rojo acento
    success: "#27ae60",      // Verde éxito
    warning: "#f39c12",      // Naranja alerta
    background: "#f8f9fa",   // Gris claro fondo
    text: "#333333",         // Gris oscuro texto
    border: "#dddddd",       // Gris bordes
    white: "#ffffff",        // Blanco
  };

  const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, "#3498db", "#9b59b6"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiRequest("/dashboard/summary"));
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const json = await response.json();
        console.log("Datos recibidos:", json);
        // Asegurar que totalServicios tenga un valor por defecto
        setData({
          ...json,
          totalServicios: json.totalServicios || json.totalProductos || 7
        });
      } catch (err) {
        console.error("Error al obtener dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const {
    totalClientes,
    totalServicios,
    totalFacturas,
    ventasPorCategoria,
    ventasPorMetodo,
    ultimasFacturas,
  } = data;

  // Componente de tarjeta de estadística mejorado
  const StatCard = ({ title, value, icon }) => (
    <div className="stat-card">
      <div className="stat-header">
        <h3>{title}</h3>
        <span className="stat-icon">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
    </div>
  );

  // Formateador de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  // Formateador de fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar onLogout={onLogout} />
        <div className="dashboard" style={{ 
          flexGrow: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: COLORS.background 
        }}>
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Cargando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar onLogout={onLogout} />
        <div className="dashboard" style={{ 
          flexGrow: 1, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: COLORS.background 
        }}>
          <div className="error-message">
            <h3>Error al cargar datos</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.background }}>
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Contenido principal */}
      <div className="dashboard" style={{ flexGrow: 1 }}>
        <header className="dashboard-header">
          <br />
          <br />
        </header>

        <div className="dashboard-content">
          {/* Estadísticas rápidas */}
          <div className="stats-grid">
            <StatCard 
              title="Total Clientes" 
              value={totalClientes} 
            />
            <StatCard 
              title="Servicios Disponibles" 
              value={totalServicios} 
            />
            <StatCard 
              title="Facturas Emitidas" 
              value={totalFacturas} 
            />
            <StatCard 
              title="Cotizaciones Pendientes" 
              value={3} 
            />
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            <div className="chart-card">
              <h2>
                <span style={{ marginRight: '0.5rem' }}></span>
                Servicios Más Vendidos
              </h2>
              <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {serviciosMasVendidos && serviciosMasVendidos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviciosMasVendidos}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                      <XAxis 
                        dataKey="servicio" 
                        stroke={COLORS.text}
                        fontSize={11}
                        angle={-15}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke={COLORS.text}
                        fontSize={12}
                        tickFormatter={(value) => {
                          const rounded = Math.round(value);
                          return `${rounded.toLocaleString('es-PE')} S/`;
                        }}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Total Vendido']}
                        labelStyle={{ color: COLORS.primary, fontWeight: 'bold' }}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        fill={COLORS.primary} 
                        radius={[4, 4, 0, 0]}
                        name="Total Vendido"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <p>📊 No hay datos de servicios disponibles</p>
                    <small>Los datos aparecerán cuando tengas proyectos registrados</small>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <h2>Estados de Cotizaciones</h2>
              <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {estadosCotizaciones && estadosCotizaciones.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={estadosCotizaciones}
                        dataKey="cantidad"
                        nameKey="estado"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ estado, cantidad, porcentaje }) => `${estado}\n${cantidad} (${porcentaje}%)`}
                        labelStyle={{ fontSize: 11, fontWeight: 'bold' }}
                      >
                        {estadosCotizaciones.map((entry, index) => {
                          let color;
                          if (entry.estado === "Pendientes") {
                            color = COLORS.warning; // Naranja (#f39c12)
                          } else if (entry.estado === "Aprobadas") {
                            color = "#3498db"; // Azul
                          } else if (entry.estado === "Rechazadas") {
                            color = COLORS.secondary; // Rojo (#e74c3c)
                          } else if (entry.estado === "Completadas") {
                            color = COLORS.success; // Verde (#27ae60)
                          }
                          return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${props.payload.cantidad} cotizaciones (${props.payload.porcentaje}%)`,
                          props.payload.estado
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => {
                          const data = estadosCotizaciones.find(e => e.estado === value);
                          return `${value}: ${data?.cantidad || 0} (${data?.porcentaje || 0}%)`;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <p>📊 No hay datos de cotizaciones</p>
                    <small>Los datos aparecerán cuando tengas cotizaciones registradas</small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cotizaciones y Proyectos Recientes con Filtro */}
          <div className="transactions-card">
            <div className="transactions-header">
              <h2>
                <span style={{ marginRight: '0.5rem' }}>
                  {activeView === 'cotizaciones' ? '' : ''}
                </span>
                {activeView === 'cotizaciones' ? 'Cotizaciones Recientes' : 'Proyectos Recientes'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Filtro de vista */}
                <div className="view-filter">
                  <button
                    className={`filter-btn ${activeView === 'cotizaciones' ? 'active' : ''}`}
                    onClick={() => setActiveView('cotizaciones')}
                  >
                    Cotizaciones
                  </button>
                  <button
                    className={`filter-btn ${activeView === 'proyectos' ? 'active' : ''}`}
                    onClick={() => setActiveView('proyectos')}
                  >
                    Proyectos
                  </button>
                </div>
                <span className="total-count">
                  Total: {activeView === 'cotizaciones' ? '4' : '2'}
                </span>
              </div>
            </div>
            
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>CLIENTE</th>
                    <th>SERVICIO</th>
                    <th>MONTO</th>
                    <th>ESTADO</th>                 
                    <th>FECHA</th>
                  </tr>
                </thead>
                <tbody>
                  {activeView === 'cotizaciones' ? (
                    <>
                      <tr className="even-row">
                        <td className="transaction-id">#COT-001</td>
                        <td className="transaction-client">Tech Solutions SAC</td>
                        <td className="transaction-service">Estrategia Digital</td>
                        <td className="transaction-amount">S/ 2,500.00</td>
                        <td className="transaction-status">
                          <span className="status-badge pendiente">PENDIENTE</span>
                        </td>
                        <td className="transaction-date">25 nov. 2025, 10:30 a. m.</td>
                      </tr>
                      <tr className="odd-row">
                        <td className="transaction-id">#COT-002</td>
                        <td className="transaction-client">Global Marketing</td>
                        <td className="transaction-service">Campaña Publicitaria</td>
                        <td className="transaction-amount">S/ 4,800.00</td>
                        <td className="transaction-status">
                          <span className="status-badge aprobada">APROBADA</span>
                        </td>
                        <td className="transaction-date">24 nov. 2025, 03:15 p. m.</td>
                      </tr>
                      <tr className="even-row">
                        <td className="transaction-id">#COT-003</td>
                        <td className="transaction-client">Innovate Corp</td>
                        <td className="transaction-service">Branding Corporativo</td>
                        <td className="transaction-amount">S/ 3,200.00</td>
                        <td className="transaction-status">
                          <span className="status-badge pendiente">PENDIENTE</span>
                        </td>
                        <td className="transaction-date">23 nov. 2025, 02:20 p. m.</td>
                      </tr>
                      <tr className="odd-row">
                        <td className="transaction-id">#COT-004</td>
                        <td className="transaction-client">Startup Hub</td>
                        <td className="transaction-service">Relaciones Públicas</td>
                        <td className="transaction-amount">S/ 1,950.00</td>
                        <td className="transaction-status">
                          <span className="status-badge rechazada">RECHAZADA</span>
                        </td>
                        <td className="transaction-date">22 nov. 2025, 11:45 a. m.</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr className="even-row">
                        <td className="transaction-id">#1</td>
                        <td className="transaction-client">GM Comunicaciones</td>
                        <td className="transaction-service">Relaciones Públicas</td>
                        <td className="transaction-amount">S/ 820.50</td>
                        <td className="transaction-status">
                          <span className="status-badge completado">COMPLETADO</span>
                        </td>
                        <td className="transaction-date">23 nov. 2025, 01:49 p. m.</td>
                      </tr>
                      <tr className="odd-row">
                        <td className="transaction-id">#2</td>
                        <td className="transaction-client">Innova Telecom</td>
                        <td className="transaction-service">Relaciones Públicas</td>
                        <td className="transaction-amount">S/ 725.50</td>
                        <td className="transaction-status">
                          <span className="status-badge completado">COMPLETADO</span>
                        </td>
                        <td className="transaction-date">22 nov. 2025, 01:49 p. m.</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 