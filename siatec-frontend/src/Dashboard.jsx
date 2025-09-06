import React from "react";
import "./Dashboard.css";
import Sidebar from "./components/Sidebar";

const Dashboard = ({ data, onLogout }) => {
  const {
    totalClientes = 0,
    totalProductos = 0,
    totalFacturas = 0,
    ventasPorCategoria = [],
    ventasPorMetodo = [],
    ultimasFacturas = [],
  } = data || {};

  const StatCard = ({ title, value }) => (
    <div className="stat-card">
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
    </div>
  );

  const ChartBar = ({ label, value, maxValue }) => {
    const percentage = (value / maxValue) * 100;
    return (
      <div className="chart-bar">
        <div className="chart-bar-label">{label}</div>
        <div className="chart-bar-container">
          <div className="chart-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <div className="chart-bar-value">{value}</div>
      </div>
    );
  };

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
              <h2>Ventas por Categoría</h2>
              <div className="chart-bars">
                {ventasPorCategoria.map((item, index) => (
                  <ChartBar
                    key={index}
                    label={item.categoria}
                    value={item.total}
                    maxValue={Math.max(...ventasPorCategoria.map(v => v.total), 1)}
                  />
                ))}
              </div>
            </div>

            <div className="chart-card">
              <h2>Ventas por Método de Pago</h2>
              <div className="chart-bars">
                {ventasPorMetodo.map((item, index) => (
                  <ChartBar
                    key={index}
                    label={item.metodo}
                    value={item.total}
                    maxValue={Math.max(...ventasPorMetodo.map(v => v.total), 1)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Últimas facturas */}
          <div className="transactions-card">
            <h2>Últimas Facturas</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Monto</th>
                  <th>Condición</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimasFacturas.map((f) => (
                  <tr key={f.id}>
                    <td className="transaction-id">{f.id}</td>
                    <td className="transaction-desc">{f.cliente}</td>
                    <td className="transaction-amount">{f.total} S/</td>
                    <td className="transaction-condition">{f.metodo}</td>
                    <td>{new Date(f.fecha).toLocaleString()}</td>
                    <td className="transaction-class">{f.h}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
