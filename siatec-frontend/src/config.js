// Configuración de la API
// En desarrollo usa localhost, en producción usa la URL de Vercel
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Función helper para construir URLs de la API
export const apiRequest = (endpoint) => {
  // Si el endpoint ya empieza con /api, no agregar el prefijo
  if (endpoint.startsWith('/api')) {
    return `${API_URL}${endpoint}`;
  }
  // Si no, agregar /api
  return `${API_URL}/api${endpoint}`;
};

