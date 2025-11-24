// src/components/Sidebar.jsx
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/"); // Redirige al login
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Clientes", path: "/clientes", icon: "👥" },
    { name: "Productos", path: "/producto", icon: "📦" },
    { name: "Facturas", path: "/factura", icon: "🧾" },
  ];

  // Paleta de colores GM Comunicaciones
  const colors = {
    primary: "#1a3e6d",
    secondary: "#e74c3c",
    accent: "#27ae60",
    background: "#0a166a",
    hover: "#2c5282",
    text: "#ffffff",
    border: "#2d3748"
  };

  return (
    <>
      {/* Sidebar */}
      <div style={{
        width: "260px",
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colors.background} 0%, ${colors.primary} 100%)`,
        color: colors.text,
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)",
        position: "relative",
        zIndex: 100
      }}>
        
        {/* Logo */}
        <div style={{ 
          padding: "2rem 1.5rem 1.5rem",
          borderBottom: `1px solid ${colors.border}`,
          textAlign: "center"
        }}>
          <div style={{ 
            fontWeight: "700", 
            fontSize: "1.4rem",
            background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "0.5rem"
          }}>
            GM Comunicaciones
          </div>
          <div style={{
            fontSize: "0.8rem",
            opacity: 0.8,
            color: "#cbd5e0"
          }}>
            Agencia de Relaciones Públicas
          </div>
        </div>

        {/* Menú de navegación */}
        <nav style={{ 
          flex: 1, 
          padding: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }}>
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={index}
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.5rem",
                  margin: "0 0.5rem",
                  color: colors.text,
                  textDecoration: "none",
                  background: isActive 
                    ? `linear-gradient(135deg, ${colors.secondary} 0%, #c53030 100%)` 
                    : "transparent",
                  borderRadius: "8px",
                  fontWeight: isActive ? "600" : "500",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: isActive ? "none" : `1px solid transparent`,
                  position: "relative",
                  overflow: "hidden"
                }}
                className="sidebar-link"
              >
                {/* Efecto de fondo hover */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${colors.hover} 0%, ${colors.primary} 100%)`,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  zIndex: 1
                }} className="hover-bg" />
                
                {/* Ícono */}
                <span style={{
                  fontSize: "1.2rem",
                  zIndex: 2,
                  position: "relative"
                }}>
                  {item.icon}
                </span>
                
                {/* Texto */}
                <span style={{
                  zIndex: 2,
                  position: "relative",
                  fontSize: "0.95rem"
                }}>
                  {item.name}
                </span>

                {/* Indicador activo */}
                {isActive && (
                  <div style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "6px",
                    height: "6px",
                    backgroundColor: colors.text,
                    borderRadius: "50%",
                    zIndex: 2
                  }} />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer del sidebar */}
        <div style={{
          padding: "1.5rem",
          borderTop: `1px solid ${colors.border}`,
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "0.8rem",
            opacity: 0.7,
            color: "#cbd5e0",
            marginBottom: "1rem"
          }}>
            Sistema de Gestión
          </div>
          
          {/* Botón de cerrar sesión dentro del sidebar */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "none",
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${colors.secondary} 0%, #c53030 100%)`,
              color: colors.text,
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              fontSize: "0.9rem"
            }}
            className="logout-btn"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CSS para efectos hover */}
      <style jsx>{`
        .sidebar-link:hover .hover-bg {
          opacity: 1;
        }
        
        .sidebar-link:hover {
          transform: translateX(4px);
        }
        
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
        }
        
        .sidebar-link {
          position: relative;
        }
        
        .sidebar-link::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: ${colors.secondary};
          border-radius: 0 2px 2px 0;
          transition: height 0.3s ease;
        }
        
        .sidebar-link:hover::before {
          height: 60%;
        }
      `}</style>
    </>
  );
}