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
    totalProductos: 0,
    totalFacturas: 0,
    ventasPorCategoria: [],
    ventasPorMetodo: [],
    ultimasFacturas: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setData(json);
      } catch (err) {
        console.error("❌ Error al obtener dashboard:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const {
    totalClientes,
    totalProductos,
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
         
            <h1>📊 logo de la agencia</h1>
            <p>Resumen general de ventas y actividades</p>
       
        </header>

        <div className="dashboard-content">
          {/* Estadísticas rápidas */}
          <div className="stats-grid">
            <StatCard 
              title="Total Clientes" 
              value={totalClientes} 
              icon="👥"
            />
            <StatCard 
              title="Productos/Servicios" 
              value={totalProductos} 
              icon="📦"
            />
            <StatCard 
              title="Facturas Emitidas" 
              value={totalFacturas} 
              icon="🧾"
            />
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            <div className="chart-card">
              <h2>📈 Categorías Más Vendidas</h2>
              <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {ventasPorCategoria && ventasPorCategoria.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ventasPorCategoria}>
                      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                      <XAxis 
                        dataKey="categoria" 
                        stroke={COLORS.text}
                        fontSize={12}
                      />
                      <YAxis 
                        stroke={COLORS.text}
                        fontSize={12}
                      />
                      <Tooltip 
                        formatter={(value) => [formatCurrency(value), 'Total Vendido']}
                        labelStyle={{ color: COLORS.primary, fontWeight: 'bold' }}
                      />
                      <Bar 
                        dataKey="total_vendido" 
                        fill={COLORS.primary} 
                        radius={[4, 4, 0, 0]}
                        name="Total Vendido"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <p>📊 No hay datos de categorías disponibles</p>
                    <small>Los datos aparecerán cuando tengas ventas registradas</small>
                  </div>
                )}
              </div>
            </div>

            <div className="chart-card">
              <h2>💰 Ventas por Método de Pago</h2>
              <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
                {ventasPorMetodo && ventasPorMetodo.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ventasPorMetodo}
                        dataKey="total"
                        nameKey="metodo"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                        labelStyle={{ fontSize: 12, fontWeight: 'bold' }}
                      >
                        {ventasPorMetodo.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name) => [`${value} ventas`, name]}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-state">
                    <p>💳 No hay datos de métodos de pago</p>
                    <small>Registra ventas para ver la distribución</small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Últimas facturas - CORREGIDO */}
          <div className="transactions-card">
            <div className="transactions-header">
              <h2>🧾 Últimas Facturas</h2>
              <span className="total-count">Total: {ultimasFacturas?.length || 0}</span>
            </div>
            
            {ultimasFacturas && ultimasFacturas.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Cliente</th>
                      <th>Monto</th>
                      <th>Método</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ultimasFacturas.map((f, index) => (
                      <tr key={f.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                        <td className="transaction-id">#{f.id}</td>
                        <td className="transaction-client">{f.cliente}</td>
                        <td className="transaction-amount">{formatCurrency(f.total)}</td>
                        <td className="transaction-method">
                          <span className={`payment-badge ${f.metodo?.toLowerCase() || 'default'}`}>
                            {f.metodo || "N/A"}
                          </span>
                        </td>
                        <td className="transaction-date">{formatDate(f.fecha)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>📄 No hay facturas registradas</p>
                <small>Las facturas aparecerán aquí cuando las registres</small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;