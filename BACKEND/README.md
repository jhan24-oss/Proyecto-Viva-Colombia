# BACKEND - Viva Colombia

Instrucciones para preparar la base de datos y ejecutar la API.

Requisitos:
- MySQL o MariaDB instalado y accesible.
- Node.js 18+ (o compatible).

1) Crear la base de datos y tablas

Desde una consola MySQL (o cliente como MySQL Workbench) ejecuta el archivo `database.sql` que ya está en esta carpeta:

```sql
-- Ejemplo usando cliente mysql en Windows (CMD o PowerShell):
mysql -u root -p < database.sql
```

Esto crea la base `viva_colombia` y las tablas: `usuarios`, `reservas_destinos`, `reservas_alojamientos`, `contactos`.

Si prefieres ejecutar las sentencias manualmente, abre `database.sql` y cópialas.

2) Configurar credenciales de conexión

El archivo `config/db.js` usa variables de entorno con estos nombres (si no se establecen, usa valores por defecto):

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `` empty)
- `DB_NAME` (default: `viva_colombia`)

Ejemplo en PowerShell antes de iniciar el servidor:

```powershell
$env:DB_USER = "root"
$env:DB_PASSWORD = "tu_contraseña"
$env:DB_NAME = "viva_colombia"
npm run dev
```

3) Iniciar servidor

```powershell
cd BACKEND
npm install
npm run dev
```

4) Endpoints útiles para ver los datos (GET):

- `GET /api/usuarios` → lista usuarios (sin passwords)
- `GET /api/reservas/destinos` → lista reservas de destinos
- `GET /api/reservas/alojamientos` → lista reservas de alojamientos
- `GET /api/contact` → lista mensajes de contacto

5) Notas
- No se realizaron cambios en el frontend. El backend solo expone API REST y persiste en MySQL usando `mysql2`.
- Si quieres que el servidor cree la base automáticamente, puedo añadir código adicional para ello (requiere privilegios del usuario DB).

Si quieres, hago una corrida de comprobación adicional creando datos de ejemplo o añado endpoints protegidos por una clave simple para ver los datos desde el navegador.