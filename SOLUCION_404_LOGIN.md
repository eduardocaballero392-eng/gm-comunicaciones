# 🔧 Solución al Error 404 en /api/login

## Problema
El servidor está devolviendo un error 404 cuando intentas acceder a `/api/login`.

## Solución

### Paso 1: Detener el servidor actual
1. Ve a la terminal donde está corriendo el servidor
2. Presiona `Ctrl + C` para detenerlo

### Paso 2: Reiniciar el servidor
```bash
npm start
```

O si estás usando nodemon:
```bash
npm run dev
```

### Paso 3: Verificar que el servidor esté corriendo
Deberías ver un mensaje como:
```
✅ Conectado a MySQL con ID: X
🚀 Servidor corriendo en http://localhost:3001
```

### Paso 4: Probar el login
Usa estas credenciales:
- **Email:** `admin@prueba.com`
- **Contraseña:** `admin123`

O:
- **Email:** `vendedor@prueba.com`
- **Contraseña:** `vendedor123`

## Verificación

Si después de reiniciar el servidor aún tienes problemas, verifica:

1. **Que el servidor esté escuchando en el puerto 3001:**
   ```bash
   netstat -ano | findstr :3001
   ```

2. **Que las rutas estén definidas correctamente:**
   - `/api/login` ✅
   - `/login` ✅

3. **Que CORS esté habilitado:**
   - `app.use(cors())` debe estar antes de las rutas

## Si el problema persiste

1. Verifica la consola del navegador (F12) para ver el error exacto
2. Verifica la consola del servidor para ver si hay errores
3. Asegúrate de que la base de datos esté conectada

