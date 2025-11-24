import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";
import { apiRequest } from "./config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(apiRequest("/login"), {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("rol", response.data.rol);
      localStorage.setItem("nombre", response.data.nombre);

      toast.success(
        `Inicio de sesión exitoso 🎉 Bienvenido ${response.data.nombre} (${response.data.rol})`
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        setError("Usuario o contraseña incorrectos.");
      } else if (err.request) {
        setError("Error de conexión. Asegúrate de que el servidor está corriendo.");
      } else {
        setError("Ocurrió un error inesperado.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-decoration"></div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">📊</span>
            <h1>GM Comunicaciones</h1>
          </div>
          <p className="login-subtitle">Agencia de Relaciones Públicas</p>
        </div>

        <div className="login-content">
          <h2>Bienvenido de vuelta</h2>
          <p>Ingresa tus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">CORREO ELECTRÓNICO 📧</label>
              <div className="input-container">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-login"
                  placeholder="ejemplo@gmcomunicaciones.com"
                  required
                  disabled={isLoading}
                />
              
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">CONTRASEÑA 🔒</label>
              <div className="input-container">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-login"
                  placeholder="Ingresa tu contraseña "
          
                  required
                  disabled={isLoading}
                />
                
              </div>
            </div>

            <button 
              type="submit" 
              className={`btn-login ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="login-spinner"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                 
                  Ingresar al Sistema
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="login-footer">
            <p>¿Necesitas ayuda? Contacta al administrador del sistema</p>
          </div>
        </div>
      </div>
    </div>
  );
}