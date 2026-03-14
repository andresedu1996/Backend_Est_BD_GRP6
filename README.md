# Backend_Est_BD_GRP6

Repositorio del backend del proyecto, con documentación, scripts SQL y colección de Postman como parte de los entregables finales.

## Entregables finales

1. Link del repositorio backend (GitHub):
   - Agregar aquí el enlace del repositorio.
2. Carpeta `/docs` dentro del repositorio con:
   - Diagrama Chen en PDF o imagen
   - Diagrama Crow's Foot en PDF o imagen
   - Diagrama de base de datos en Supabase
3. Carpeta `/sql` con:
   - `schema.sql`
   - `seed.sql`
4. Carpeta `/postman` con:
   - colección de Postman
   - environment de Postman
5. `README.md` con:
   - instrucciones para ejecutar el backend
   - variables de entorno requeridas

## Estructura del repositorio

```text
/
|-- docs/
|-- postman/
|-- sql/
`-- README.md
```

## Cómo ejecutar el backend

Completar esta sección según la tecnología utilizada en el proyecto.

Ejemplo general:

```bash
# instalar dependencias
npm install

# ejecutar en desarrollo
npm run dev
```

## Variables de entorno

Crear un archivo `.env` con las variables necesarias para el proyecto.

Ejemplo:

```env
PORT=3000
DATABASE_URL=
SUPABASE_URL=
SUPABASE_KEY=
```

## Contenido esperado por carpeta

### `/docs`

Incluir la documentación visual del modelo de datos:

- Diagrama Chen
- Diagrama Crow's Foot
- Diagrama de base de datos generado en Supabase

### `/sql`

Incluir los scripts necesarios para la base de datos:

- `schema.sql`: definición del esquema
- `seed.sql`: datos iniciales o de prueba

### `/postman`

Incluir los archivos para probar la API:

- colección de endpoints
- archivo de entorno con variables configurables
