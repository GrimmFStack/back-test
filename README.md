Descripción
API RESTful desarrollado en Node.js y PostgreSQL para la gestión de productos y marcas. Incluye autenticación JWT, operaciones CRUD, búsqueda avanzada y sistema de registro de actividades.

Características principales
Autenticación segura mediante JWT
CRUD completo para productos y marcas
Búsqueda avanzada de productos con múltiples filtros
Eliminación lógica (no física) de registros
Sistema de logs para auditoría de operaciones
Documentación API con Swagger UI
Desplegado en Render para acceso público

Tecnologías utilizadas
Backend: Node.js + Express
Base de datos: PostgreSQL
Autenticación: JSON Web Tokens (JWT)
Documentación: Swagger
Hosting: Render

Estructura del proyecto
src/
├── config/
│   └── db.js            # Configuración de conexión a PostgreSQL
├── controllers/
│   ├── authController.js # Lógica de autenticación
│   ├── brandController.js # Operaciones con marcas
│   └── productController.js # Operaciones con productos
├── middlewares/
│   └── auth.js          # Middleware de autenticación JWT
├── models/
│   ├── Brand.js         # Modelo de marcas
│   ├── Product.js       # Modelo de productos
│   └── Log.js           # Modelo de registro de actividades
├── routes/
│   ├── auth.js          # Rutas de autenticación
│   ├── brands.js        # Rutas para marcas
│   └── products.js      # Rutas para productos

Endpoints principales
Autenticación
POST /auth/register - Registrar nuevo usuario
POST /auth/login - Iniciar sesión (obtener token)

Marcas
GET /brands - Obtener todas las marcas activas
POST /brands - Crear nueva marca
PUT /brands/{id} - Actualizar marca
DELETE /brands/{id} - Eliminar marca (lógicamente)
PATCH /brands/{id}/activate - Activar/desactivar marca

Productos
GET /products - Listar todos los productos
POST /products - Crear nuevo producto
GET /products/search - Buscar productos con filtros
PUT /products/{id} - Actualizar producto
DELETE /products/{id} - Eliminar producto (lógicamente)

Ejemplos de uso
Autenticación
# Registro de usuario
curl -X POST 'https://back-test-63v5.onrender.com/api/auth/register' \
-H 'Content-Type: application/json' \
-d '{"email": "usuario@ejemplo.com", "password": "clave123"}'

# Login
curl -X POST 'https://back-test-63v5.onrender.com/api/auth/login' \
-H 'Content-Type: application/json' \
-d '{"email": "usuario@ejemplo.com", "password": "clave123"}'

Operaciones con productos
# Crear producto (requiere token)
curl -X POST 'https://back-test-63v5.onrender.com/api/products' \
-H 'Authorization: Bearer token_jwt' \
-H 'Content-Type: application/json' \
-d '{"clave": "PROD-001", "nombre": "Producto Ejemplo", "precio": 99.99, "brand_id": 1}'
# Búsqueda avanzada
curl -X GET 'https://back-test-63v5.onrender.com/api/products/search?nombre=ejemplo&marca=1'

Requisitos del sistema
Node.js versión 16 o superior
PostgreSQL

Dependencias principales:
express
pg
jsonwebtoken
swagger-ui-express

Documentación interactiva
La documentación completa con ejemplos está disponible en:
https://back-test-63v5.onrender.com/api-docs

Notas importantes
Todos los endpoints (excepto login/registro) requieren autenticación mediante JWT.
Las eliminaciones son lógicas (se marcan como eliminadas pero permanecen en la base de datos
El sistema registra todas las operaciones críticas en la tabla de logs.
