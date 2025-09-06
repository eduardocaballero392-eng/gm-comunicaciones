import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Clientes from "./Clientes";
import "react-toastify/dist/ReactToastify.css";

// Datos de ejemplo para dashboard
const dummyData = {
  totalClientes: 12,
  totalProductos: 50,
  totalFacturas: 8,
  ventasPorCategoria: [
    { categoria: "Electrónica", total: 20 },
    { categoria: "Ropa", total: 15 },
    { categoria: "Hogar", total: 10 },
    { categoria: "Alimentos", total: 5 },
  ],
  ventasPorMetodo: [
    { metodo: "Efectivo", total: 25 },
    { metodo: "Tarjeta", total: 15 },
    { metodo: "Yape", total: 10 },
  ],
  ultimasFacturas: [
    { id: 1, cliente: "Juan Pérez", total: 150, metodo: "Efectivo", fecha: new Date() },
    { id: 2, cliente: "María López", total: 200, metodo: "Tarjeta", fecha: new Date() },
    { id: 3, cliente: "Carlos Rojas", total: 75, metodo: "Yape", fecha: new Date() },
  ],
};

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            token ? <Dashboard data={dummyData} onLogout={() => localStorage.removeItem("token")} /> : <Navigate to="/" />
          }
        />

        <Route
          path="/clientes"
          element={token ? <Clientes /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
