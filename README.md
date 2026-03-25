# Backend_Est_BD_GRP6

Backend base con Node.js, Express y PostgreSQL para trabajar con una base de datos en Supabase.

## Requisitos

- Node.js 18 o superior
- npm 9 o superior
- Un proyecto de Supabase con acceso a la cadena de conexion de PostgreSQL

## Archivos importantes

```text
/
|-- .env.example
|-- db.js
|-- server.js
|-- sql/
|   |-- schema.sql
|   `-- seed.sql
`-- package.json
```

## Variables de entorno

Crea un archivo `.env` tomando como base `.env.example`.

```env
PORT=3000
DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@[TU_HOST]:5432/postgres
DB_SSL=true
```

### Como obtener `DATABASE_URL` en Supabase

1. Entra a tu proyecto de Supabase.
2. Ve a `Project Settings`.
3. Abre la seccion `Database`.
4. Copia la cadena `Connection string` de tipo `URI`.
5. Pegala en `DATABASE_URL`.

## Instalacion

- Instalar Node JS https://nodejs.org/en/download

```bash
npm install
```

## Inicializar la base de datos

Ejecuta el contenido de `sql/schema.sql` en el editor SQL de Supabase.

Si quieres datos de prueba, ejecuta despues `sql/seed.sql`.

## Ejecutar el backend

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Endpoints de prueba

- `GET /`
- `GET /health`
- `GET /health/db`
- `GET /api/personas`
- `GET /api/personas/:id`
- `POST /api/personas`
- `PUT /api/personas/:id`
- `DELETE /api/personas/:id`
- `GET /api/telefonos`
- `GET /api/telefonos/:id`
- `POST /api/telefonos`
- `PUT /api/telefonos/:id`
- `DELETE /api/telefonos/:id`
- `GET /api/sedes`
- `GET /api/sedes/:id`
- `POST /api/sedes`
- `PUT /api/sedes/:id`
- `DELETE /api/sedes/:id`
- `GET /api/actividades`
- `GET /api/actividades/:id`
- `POST /api/actividades`
- `PUT /api/actividades/:id`
- `DELETE /api/actividades/:id`
- `GET /api/reservas`
- `GET /api/reservas/:id`
- `POST /api/reservas`
- `PUT /api/reservas/:id`
- `DELETE /api/reservas/:id`
- `GET /api/membresias`
- `GET /api/membresias/:id`
- `POST /api/membresias`
- `PUT /api/membresias/:id`
- `DELETE /api/membresias/:id`
- `GET /api/pagos`
- `GET /api/pagos/:id`
- `POST /api/pagos`
- `PUT /api/pagos/:id`
- `DELETE /api/pagos/:id`

## Notas

- `GET /health/db` confirma si la conexion a Supabase funciona.
- Si Supabase exige SSL, deja `DB_SSL=true`.
- Si instalaste Node.js y `npm` no responde en la terminal, reinicia la terminal o corrige el PATH.


## Datos de ENV

- PORT=3000
- DATABASE_URL=postgresql://postgres:Lp9iAyjpyf!fv4!@db.jnayohlizegcgzsvxjqx.supabase.co:5432/postgres
- DB_SSL=true