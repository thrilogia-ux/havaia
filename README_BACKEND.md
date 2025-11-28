# Backend API - Gentum.ar

## 📡 Endpoints Disponibles

### Experiencias
- `GET /api/experiencias` - Obtener todas las experiencias (con filtros opcionales)
- `GET /api/experiencias?id=1` - Obtener experiencia por ID
- `POST /api/experiencias` - Crear nueva experiencia

**Filtros disponibles:**
- `category` - Filtrar por categoría
- `search` - Búsqueda por texto
- `language` - Filtrar por idioma
- `minPrice` - Precio mínimo
- `maxPrice` - Precio máximo

**Ejemplo:**
```
GET /api/experiencias?category=Gastronomía&search=kosher
```

### Grupos
- `GET /api/grupos` - Obtener todos los grupos
- `GET /api/grupos?userId=123` - Obtener grupos de un usuario
- `GET /api/grupos/1` - Obtener grupo por ID
- `POST /api/grupos` - Crear nuevo grupo
- `PUT /api/grupos/1` - Actualizar grupo

### Mensajes
- `GET /api/grupos/1/mensajes` - Obtener mensajes de un grupo
- `POST /api/grupos/1/mensajes` - Enviar mensaje a un grupo

### Posts (Comunidad)
- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts?category=Gastronomía` - Filtrar por categoría
- `POST /api/posts` - Crear nuevo post

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar nuevo usuario

## 💾 Almacenamiento

Los datos se guardan en archivos JSON en la carpeta `/data`:
- `experiencias.json`
- `grupos.json`
- `usuarios.json`
- `mensajes.json`
- `posts.json`
- `subscriptions.json`

## 🔄 Migración de localStorage a API

Los componentes ahora pueden usar:
- `localStorage` (actual) - Para desarrollo rápido
- `API` (nuevo) - Para producción y persistencia real

## 🚀 Próximos Pasos

1. Migrar todos los componentes a usar la API
2. Agregar autenticación JWT real
3. Conectar a base de datos real (PostgreSQL/MongoDB)
4. Agregar validaciones y seguridad
5. Implementar paginación
6. Agregar rate limiting


