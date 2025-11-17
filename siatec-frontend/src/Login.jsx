import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

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
      const response = await axios.post("http://localhost:3001/login", {
        email,
        password,
      });

      // Guardar token, rol y nombre en localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("rol", response.data.rol);
      localStorage.setItem("nombre", response.data.nombre);

      // Mostrar notificación de éxito
      toast.success(
        `Inicio de sesión exitoso 🎉 Bienvenido ${response.data.nombre} (${response.data.rol})`
      );

      // Esperar 3 segundos antes de redirigir
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
      <div className="login-card">
        <h2>Bienvenido a VascoTec</h2>
        <p>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-login"
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-login"
              placeholder="********"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}