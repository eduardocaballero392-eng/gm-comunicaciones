// Script simple para probar login usando fetch nativo (Node 18+)
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

async function probarLogin() {
  console.log("=".repeat(80));
  console.log("🔐 PROBANDO LOGIN CON USUARIOS DE PRUEBA");
  console.log("=".repeat(80));
  console.log();

  for (const usuario of usuariosPrueba) {
    try {
      console.log(`Probando: ${usuario.email}...`);
      
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: usuario.email,
          password: usuario.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log(`✅ Login exitoso para ${usuario.email}`);
        console.log(`   Token recibido: ${data.token ? "Sí" : "No"}`);
        console.log(`   Rol: ${data.rol}`);
        console.log(`   Nombre: ${data.nombre}`);
        console.log();
      } else {
        console.log(`❌ Error al hacer login con ${usuario.email}:`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Mensaje: ${data.error || data.message}`);
        console.log();
      }
    } catch (error) {
      console.log(`❌ Error de conexión con ${usuario.email}:`);
      console.log(`   ${error.message}`);
      console.log(`   ¿Está el servidor corriendo en ${API_URL}?`);
      console.log();
    }
  }

  console.log("=".repeat(80));
  console.log("💡 Si todos los logins fallaron, verifica:");
  console.log("   1. Que el servidor esté corriendo: npm start");
  console.log("   2. Que hayas reiniciado el servidor después de los cambios");
  console.log("   3. Que la base de datos esté conectada");
  console.log("=".repeat(80));
}

probarLogin();

