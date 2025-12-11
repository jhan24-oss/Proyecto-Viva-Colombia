# Panel Admin (FRONTEND)

Este README explica cómo abrir la página `admin.html` servida por el backend y realizar comprobaciones rápidas.

Resumen rápido
- URL para abrir en el navegador (si el backend corre en la máquina local y en el puerto por defecto 4000):
  - http://localhost:4000/admin.html

Requisitos
- El backend debe estar ejecutándose en la carpeta `BACKEND` (ver `BACKEND/server.js`).
- El backend sirve la carpeta `FRONTEND` como archivo estático, por eso `admin.html` se puede abrir a través de `http://localhost:4000/admin.html`.
- La API del backend escucha en `http://localhost:4000/api` y la página admin hace peticiones relativas a `/api`.

Arrancar el backend (ejemplo PowerShell)
1. Abre PowerShell y sitúate en la carpeta `BACKEND`:
```powershell
Set-Location -Path "C:\Users\57320\Downloads\Proyecto-Viva-Colombia\BACKEND"
```
2. (Opcional) configura variables de entorno para la conexión a la base de datos. Ejemplo si usas el usuario `viva_user` y MySQL en el puerto `3307`:
```powershell
$env:DB_USER='viva_user'
$env:DB_PASSWORD='TuContrasenaAqui'
$env:DB_NAME='viva_colombia'
$env:DB_PORT='3307'
npm run dev
```

Arrancar el backend (ejemplo CMD)
```cmd
cd /d "C:\Users\57320\Downloads\Proyecto-Viva-Colombia\BACKEND"
set DB_USER=viva_user
set DB_PASSWORD=TuContrasenaAqui
set DB_NAME=viva_colombia
set DB_PORT=3307
npm run dev
```

Abrir la página admin
- Con el backend en ejecución, abre en tu navegador:
  - http://localhost:4000/admin.html
- La página cargará datos desde los endpoints del backend (`/api/usuarios`, `/api/reservas/*`, `/api/contact`).

Si tu backend corre en otro host o puerto
- Si el backend no está en `localhost:4000`, abre `FRONTEND/admin.js` y cambia la constante `API_BASE` a la URL completa, por ejemplo:
```js
// admin.js
const API_BASE = 'http://mi-servidor:4000/api';
```

Solución de problemas comunes
- Mensaje "Failed to fetch" en la UI:
  - Asegúrate de que abriste `http://localhost:4000/admin.html` y no el archivo local `file://.../admin.html`.
  - Comprueba que el servidor está escuchando en el puerto 4000: `netstat -ano | findstr :4000`.
  - Prueba el endpoint de estado desde PowerShell:
    ```powershell
    Invoke-RestMethod -Uri http://127.0.0.1:4000/api/status -Method Get
    ```
  - Si devuelve error, mira la terminal donde corre `npm run dev` y pega aquí los logs.

- Error de conexión a MySQL (Access denied / authentication):
  - Verifica usuario/contraseña y puerto. Prueba desde la consola MySQL:
    ```powershell
    & 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' -u viva_user -p -P 3307 -e "USE viva_colombia; SHOW TABLES;"
    ```
  - Si falla con `Access denied`, crea o reconfigura el usuario (necesitas credenciales `root`):
    ```sql
    CREATE USER IF NOT EXISTS 'viva_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'TuContrasena';
    GRANT ALL PRIVILEGES ON `viva_colombia`.* TO 'viva_user'@'localhost';
    FLUSH PRIVILEGES;
    ```

Opcional: servir archivos estáticos con otra herramienta
- Si prefieres no usar el backend para servir `admin.html`, puedes ejecutar un servidor estático (por ejemplo `live-server` o `python -m http.server`) desde la carpeta `FRONTEND`, pero en ese caso **debes** configurar `API_BASE` en `admin.js` a la URL completa del backend (p. ej. `http://localhost:4000/api`) para que las peticiones lleguen al backend.

Notas de seguridad
- Evita usar el usuario `root` en producción. Crea un usuario MySQL con permisos limitados para la aplicación.
- No pongas contraseñas en scripts públicos. Usa variables de entorno o un fichero `.env` en entornos controlados.

Si necesitas, puedo:
- Añadir una ruta `/admin` que haga redirect a `/admin.html`.
- Incluir exportar CSV o filtros en la UI.
- Crear un `README` similar en `BACKEND` con pasos resumidos.

-- Fin --
