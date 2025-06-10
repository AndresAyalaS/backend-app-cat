# mi-proyecto

Proyecto de gestión de gatos, imágenes y usuarios.

## Instalación

```bash
npm install
```

## Scripts

- `npm start` — Inicia el servidor en modo producción.
- `npm run dev` — Inicia el servidor en modo desarrollo con nodemon.
- `npm run build` — Compila el proyecto TypeScript.
- `npm test` — Ejecuta las pruebas unitarias.

## Variables de entorno

Crea un archivo `.env` en la raíz con el siguiente contenido:

```
CAT_API_KEY=tu_api_key_de_thecatapi
MONGO_URI=tu_uri_de_mongodb
PORT=3000
```

## Librerías principales instaladas

### Dependencias

- **express** — Framework web para Node.js.
- **mongoose** — ODM para MongoDB.
- **dotenv** — Manejo de variables de entorno.
- **cors** — Middleware para habilitar CORS.
- **bcryptjs** — Encriptación de contraseñas.
- **jsonwebtoken** — Autenticación con JWT.
- **swagger-jsdoc** y **swagger-ui-express** — Documentación de API.
- **axios** — Cliente HTTP para consumir APIs externas.

### Dependencias de desarrollo

- **typescript** — Soporte para TypeScript.
- **ts-node** — Ejecutar TypeScript directamente.
- **nodemon** — Recarga automática en desarrollo.
- **jest** — Pruebas unitarias.
- **ts-jest** — Soporte de Jest para TypeScript.
- **@types/\*** — Tipados para TypeScript de las librerías usadas.
- **mongodb-memory-server** — MongoDB en memoria para pruebas.

---

## Endpoints principales

- `/cats/breeds` — Listado de razas de gatos.
- `/cats/breeds/:breed_id` — Detalle de una raza.
- `/cats/breeds/search?q=...` — Buscar razas.
- `/images/:image_id/breeds` — Razas asociadas a una imagen.
- `/users/register` — Registro de usuario.
- `/users/login` — Login de usuario.

---

## Swagger

La documentación interactiva está disponible en:  
`http://localhost:3000/api-docs`