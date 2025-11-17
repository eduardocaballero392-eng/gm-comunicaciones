// Script para crear usuarios de prueba con contraseñas conocidas
import express from "express";
import mysql from "mysql2";
import bcrypt from "bcryptjs";

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

  // Usuarios de prueba a crear
  const usuariosPrueba = [
    {
      nombre: "Admin Prueba",
      email: "admin@prueba.com",
      password: "admin123",
      rol: "admin"
    },
    {
      nombre: "Vendedor Prueba",
      email: "vendedor@prueba.com",
      password: "vendedor123",
      rol: "vendedor"
    }
  ];

  console.log("=".repeat(80));
  console.log("🔧 CREANDO USUARIOS DE PRUEBA");
  console.log("=".repeat(80));
  console.log();

  let creados = 0;
  let errores = 0;

  usuariosPrueba.forEach((usuario, index) => {
    // Verificar si el usuario ya existe
    db.query("SELECT * FROM usuarios WHERE email = ?", [usuario.email], (err, results) => {
      if (err) {
        console.error(`❌ Error al verificar usuario ${usuario.email}:`, err);
        errores++;
        return;
      }

      if (results.length > 0) {
        console.log(`⚠️  Usuario ${usuario.email} ya existe. Saltando...`);
        console.log();
        if (index === usuariosPrueba.length - 1) {
          mostrarResumen(creados, errores);
        }
        return;
      }

      // Crear el usuario
      const hashedPassword = bcrypt.hashSync(usuario.password, 10);
      
      db.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?,?,?,?)",
        [usuario.nombre, usuario.email, hashedPassword, usuario.rol],
        (err, result) => {
          if (err) {
            console.error(`❌ Error al crear usuario ${usuario.email}:`, err);
            errores++;
          } else {
            console.log(`✅ Usuario creado exitosamente:`);
            console.log(`   Nombre: ${usuario.nombre}`);
            console.log(`   Email: ${usuario.email}`);
            console.log(`   Contraseña: ${usuario.password}`);
            console.log(`   Rol: ${usuario.rol}`);
            console.log();
            creados++;
          }

          // Mostrar resumen al final
          if (index === usuariosPrueba.length - 1) {
            mostrarResumen(creados, errores);
          }
        }
      );
    });
  });

  function mostrarResumen(creados, errores) {
    console.log("=".repeat(80));
    console.log("📊 RESUMEN:");
    console.log(`   ✅ Usuarios creados: ${creados}`);
    console.log(`   ❌ Errores: ${errores}`);
    console.log("=".repeat(80));
    console.log();
    console.log("💡 Puedes usar estas cuentas para iniciar sesión:");
    console.log();
    console.log("   👑 ADMINISTRADOR:");
    console.log("      Email: admin@prueba.com");
    console.log("      Contraseña: admin123");
    console.log();
    console.log("   💼 VENDEDOR:");
    console.log("      Email: vendedor@prueba.com");
    console.log("      Contraseña: vendedor123");
    console.log();

    db.end();
  }
});

