// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Clientes from "./Clientes";
import Servicios from "./Servicios";
import Factura from "./Factura"; 
import FacturaDetalle from "./components/FacturaDetalle";
import "react-toastify/dist/ReactToastify.css";

//revisar{
const dummyData = {
  
};

//

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard
                data={dummyData}
                onLogout={() => localStorage.removeItem("token")}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/clientes"
          element={token ? <Clientes /> : <Navigate to="/" />}
        />
        <Route
          path="/servicios"
          element={token ? <Servicios /> : <Navigate to="/" />}
        />

        {/* Ruta para crear facturas */}
        <Route
          path="/factura"
          element={token ? <Factura /> : <Navigate to="/" />}
        />

        {/* Ruta para ver detalle de una factura */}
        <Route
          path="/factura/:id"
          element={token ? <FacturaDetalle /> : <Navigate to="/" />}
        />

        {/* Ruta para listar todas las facturas */}
        <Route
          path="/facturas"
          element={token ? <FacturaDetalle /> : <Navigate to="/" />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
