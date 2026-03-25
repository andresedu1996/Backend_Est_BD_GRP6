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

## Notas

- `GET /health/db` confirma si la conexion a Supabase funciona.
- Si Supabase exige SSL, deja `DB_SSL=true`.
- Si instalaste Node.js y `npm` no responde en la terminal, reinicia la terminal o corrige el PATH.
