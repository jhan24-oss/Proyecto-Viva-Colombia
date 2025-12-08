# BACKEND - Viva Colombia

Scaffolding minimal para el backend de la app `Viva Colombia`.

Requisitos locales:
- Node.js (>=16) y npm
- MySQL/MariaDB

Instalación rápida:

1. Copia el ejemplo de env y actualiza credenciales:

```powershell
copy .env.example .env
# editar .env con tus datos
```

2. Instala dependencias:

```powershell
cd BACKEND
npm install
```

3. Crea la base de datos y tablas (usar MySQL CLI o un cliente):

```sql
-- Ejecutar migrations/init.sql en tu servidor MySQL
SOURCE migrations/init.sql;
```

4. Inicia el servidor en modo desarrollo:

```powershell
npm run dev
```

Endpoints principales:
- `POST /api/auth/register` {name,email,password}
- `POST /api/auth/login` {email,password}
- `GET /api/destinations`
- `POST /api/destinations` {name,description,location,price}
- `GET /api/accommodations`
- `POST /api/accommodations` {name,location,price_per_night,description}
- `POST /api/reservations` {user_id,accommodation_id,check_in,check_out,guests,total}
- `GET /api/reservations?user_id=...`
- `POST /api/contact` {name,email,message}

Notas de seguridad:
- El login aquí devuelve una respuesta simple; para producción añade JWT/refresh tokens.
- Usa HTTPS y políticas CORS limitadas en producción.

Si quieres, puedo instalar dependencias automáticamente ahora (ejecutar `npm install`) o conectar la base de datos y probar algunos endpoints básicos.
