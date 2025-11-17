# 🚀 INSTRUCCIONES PARA REINICIAR EL SERVIDOR

## ⚠️ IMPORTANTE: El servidor debe estar corriendo para que funcione la aplicación

## Pasos para reiniciar el servidor:

### 1. Detener el servidor actual
- Ve a la terminal donde está corriendo el servidor
- Presiona `Ctrl + C` para detenerlo
- Espera a que se detenga completamente

### 2. Iniciar el servidor
```bash
npm start
```

### 3. Verificar que esté corriendo
Deberías ver estos mensajes:
```
✅ Conectado a MySQL con ID: X
🚀 Servidor corriendo en http://localhost:3001
```

### 4. Si ves errores de conexión a la base de datos
- Verifica que MySQL esté corriendo
- Verifica las credenciales en `server.js` (líneas 13-17)

## ✅ Rutas disponibles después de reiniciar:

- `/api/login` - Iniciar sesión
- `/api/register` - Registrar usuario
- `/api/usuarios` - Listar usuarios
- `/api/clientes` - CRUD de clientes
- `/api/productos` - CRUD de productos
- `/api/facturas` - CRUD de facturas
- `/api/dashboard/summary` - Resumen del dashboard

## 🔍 Verificar que el servidor está corriendo:

En PowerShell:
```powershell
netstat -ano | findstr :3001
```

Deberías ver algo como:
```
TCP    0.0.0.0:3001           0.0.0.0:0              LISTENING       XXXX
```

## ❌ Si el servidor no inicia:

1. Verifica que el puerto 3001 no esté en uso por otro proceso
2. Verifica que MySQL esté corriendo
3. Verifica las credenciales de la base de datos
4. Revisa los errores en la consola del servidor

