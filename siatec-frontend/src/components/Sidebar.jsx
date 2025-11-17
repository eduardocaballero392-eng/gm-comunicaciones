// src/components/Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/"); // Redirige al login
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Clientes", path: "/clientes" },
    { name: "Productos", path: "/producto" },
    { name: "Facturas", path: "/factura" },
   

  ];

  return (
    <>
      {/* Sidebar */}
      <div style={{
        width: "220px",
        minHeight: "100vh",
        backgroundColor: "#071274ff",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Logo + menú */}
        <div>
          <div style={{ padding: "2rem 1rem", fontWeight: "500", fontSize: "1.3rem" }}>
            GM Comunicaciones
          </div>

          <div>
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                style={({ isActive }) => ({
                  display: "block",
                  padding: "1rem 1.5rem",
                  color: "white",
                  textDecoration: "none",
                  backgroundColor: isActive ? "#3730a3" : "transparent",
                  fontWeight: isActive ? "600" : "500",
                  transition: "0.3s"
                })}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Botón flotante en esquina inferior derecha */}
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "0.5rem 1.2rem",
          border: "none",
          borderRadius: "8px",
          backgroundColor: "#3d3a3aff",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          zIndex: 1000
        }}
      >
        Cerrar sesión
      </button>
    </>
  );
}
