import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Sidebar from "./components/Sidebar";
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

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/dashboard/summary");
        
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

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
    </div>
  );

  const COLORS = ["#920707", "#dab71d", "#087fa3", "#4CAF50", "#9C27B0", "#FF9800"];

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar onLogout={onLogout} />
        <div className="dashboard" style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div>Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar onLogout={onLogout} />
        <div className="dashboard" style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "red" }}>Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Contenido principal */}
      <div className="dashboard" style={{ flexGrow: 1 }}>
        <div className="dashboard-content">
          {/* Estadísticas rápidas */}
          <div className="stats-grid">
            <StatCard title="Clientes" value={totalClientes} />
            <StatCard title="Productos" value={totalProductos} />
            <StatCard title="Facturas" value={totalFacturas} />
          </div>

          {/* Gráficos */}
          <div className="charts-grid">
            <div className="chart-card">
              <h2>Top Categorías Vendidas</h2>
              {ventasPorCategoria && ventasPorCategoria.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ventasPorCategoria}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="categoria" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No hay datos de categorías
                </p>
              )}
            </div>

            <div className="chart-card">
              <h2>Ventas por Método de Pago</h2>
              {ventasPorMetodo && ventasPorMetodo.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ventasPorMetodo}
                      dataKey="total"
                      nameKey="metodo"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={5}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ventasPorMetodo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ventas`, 'Cantidad']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                  No hay datos de ventas por método de pago
                </p>
              )}
            </div>
          </div>

          {/* Últimas facturas */}
          <div className="transactions-card">
            <h2>Últimas Facturas</h2>
            {ultimasFacturas && ultimasFacturas.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre Cliente</th>
                    <th>Monto</th>
                    <th>Método</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasFacturas.map((f) => (
                    <tr key={f.id}>
                      <td className="transaction-id">{f.id}</td>
                      <td className="transaction-desc">{f.cliente}</td>
                      <td className="transaction-amount">S/ {f.total}</td>
                      <td className="transaction-condition">{f.metodo || "N/A"}</td>
                      <td>{new Date(f.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                No hay facturas registradas
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;