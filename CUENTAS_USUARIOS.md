# 📋 Cuentas de Usuarios - GM Comunicaciones

## Usuarios Registrados en el Sistema

### 👑 Administradores

1. **Eduardo**
   - Email: `admin@senati.com`
   - ID: 1
   - Rol: admin

2. **Eduardo**
   - Email: `admin@siatec.com`
   - ID: 2
   - Rol: admin

### 💼 Vendedores

1. **Juan Perez**
   - Email: `juan@ejemplo.com`
   - ID: 3
   - Rol: vendedor

---

## ⚠️ Nota Importante

Las contraseñas están encriptadas en la base de datos usando bcrypt, por lo que **no es posible recuperarlas directamente**.

## 🔧 Opciones para Acceder

### Opción 1: Consultar con el administrador
Si olvidaste la contraseña, contacta al administrador del sistema para restablecerla.

### Opción 2: Crear un nuevo usuario de prueba
Puedes crear un nuevo usuario usando la API de registro:

**Endpoint:** `POST /api/register` o `POST /register`

**Ejemplo de solicitud:**
```json
{
  "nombre": "Usuario Prueba",
  "email": "prueba@ejemplo.com",
  "password": "123456",
  "rol": "admin"
}
```

### Opción 3: Usar el script de creación
Ejecuta el script `crear-usuario-prueba.js` para crear usuarios de prueba con contraseñas conocidas.

---

## 📡 Consultar Usuarios via API

Puedes consultar la lista de usuarios usando:

- **GET** `/api/usuarios` (para Vercel/producción)
- **GET** `/usuarios` (para servidor local)

Esto devolverá una lista de usuarios sin mostrar las contraseñas.

---

## 🛠️ Scripts Disponibles

- `mostrar-usuarios.js` - Muestra todos los usuarios registrados
- `crear-usuario-prueba.js` - Crea usuarios de prueba con contraseñas conocidas

