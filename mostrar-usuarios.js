// Script para mostrar usuarios de la base de datos
import mysql from "mysql2";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "eduardo1",
  database: "facturacion"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error al conectar con la BD:", err.stack);
    process.exit(1);
  }
  console.log("✅ Conectado a MySQL\n");
  
  // Consultar usuarios
  db.query("SELECT id, nombre, email, rol FROM usuarios ORDER BY rol, nombre", (err, results) => {
    if (err) {
      console.error("❌ Error al consultar usuarios:", err);
      db.end();
      return;
    }

    if (results.length === 0) {
      console.log("⚠️  No hay usuarios registrados en la base de datos.\n");
      console.log("💡 Puedes crear usuarios usando la ruta POST /api/register o POST /register\n");
      db.end();
      return;
    }

    console.log("=".repeat(80));
    console.log("📋 USUARIOS REGISTRADOS EN EL SISTEMA");
    console.log("=".repeat(80));
    console.log();

    // Separar por rol
    const admins = results.filter(u => u.rol === "admin");
    const vendedores = results.filter(u => u.rol === "vendedor");
    const otros = results.filter(u => u.rol !== "admin" && u.rol !== "vendedor");

    if (admins.length > 0) {
      console.log("👑 ADMINISTRADORES:");
      console.log("-".repeat(80));
      admins.forEach((user, index) => {
        console.log(`${index + 1}. Nombre: ${user.nombre}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log();
      });
    }

    if (vendedores.length > 0) {
      console.log("💼 VENDEDORES:");
      console.log("-".repeat(80));
      vendedores.forEach((user, index) => {
        console.log(`${index + 1}. Nombre: ${user.nombre}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log();
      });
    }

    if (otros.length > 0) {
      console.log("👤 OTROS ROLES:");
      console.log("-".repeat(80));
      otros.forEach((user, index) => {
        console.log(`${index + 1}. Nombre: ${user.nombre}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol: ${user.rol}`);
        console.log(`   ID: ${user.id}`);
        console.log();
      });
    }

    console.log("=".repeat(80));
    console.log(`📊 Total: ${results.length} usuario(s) registrado(s)`);
    console.log("=".repeat(80));
    console.log();
    console.log("💡 NOTA: Las contraseñas están encriptadas en la base de datos.");
    console.log("   Si necesitas crear un nuevo usuario, usa la ruta de registro.");
    console.log("   Si olvidaste una contraseña, necesitarás restablecerla.\n");

    db.end();
  });
});

