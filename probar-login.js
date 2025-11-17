// Script para probar el login con las credenciales de prueba
import axios from "axios";

const API_URL = "http://localhost:3001";

const usuariosPrueba = [
  {
    email: "admin@prueba.com",
    password: "admin123",
    nombre: "Admin Prueba"
  },
  {
    email: "vendedor@prueba.com",
    password: "vendedor123",
    nombre: "Vendedor Prueba"
  }
];

console.log("=".repeat(80));
console.log("🔐 PROBANDO LOGIN CON USUARIOS DE PRUEBA");
console.log("=".repeat(80));
console.log();

usuariosPrueba.forEach(async (usuario, index) => {
  try {
    console.log(`Probando: ${usuario.email}...`);
    
    // Probar con /api/login
    const response = await axios.post(`${API_URL}/api/login`, {
      email: usuario.email,
      password: usuario.password
    });

    console.log(`✅ Login exitoso para ${usuario.email}`);
    console.log(`   Token recibido: ${response.data.token ? "Sí" : "No"}`);
    console.log(`   Rol: ${response.data.rol}`);
    console.log(`   Nombre: ${response.data.nombre}`);
    console.log();
  } catch (error) {
    console.log(`❌ Error al hacer login con ${usuario.email}:`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Mensaje: ${error.response.data.error || error.response.data.message}`);
    } else if (error.request) {
      console.log(`   Error: No se pudo conectar al servidor. ¿Está corriendo en ${API_URL}?`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    console.log();
  }

  // Si es el último, esperar un poco y terminar
  if (index === usuariosPrueba.length - 1) {
    setTimeout(() => {
      console.log("=".repeat(80));
      console.log("💡 Si todos los logins fallaron, verifica:");
      console.log("   1. Que el servidor esté corriendo: npm start");
      console.log("   2. Que la base de datos esté conectada");
      console.log("   3. Que los usuarios existan en la BD");
      console.log("=".repeat(80));
      process.exit(0);
    }, 1000);
  }
});

