# 🎛️ Panel de Administración - Gentum.ar

## 📋 Descripción

El panel de administración permite gestionar todos los contenidos de la plataforma Gentum.ar desde un único lugar. Está diseñado con dos niveles de acceso:

- **Administrador General**: Acceso completo a todas las funcionalidades
- **Anfitrión (Host)**: Puede gestionar solo sus propias experiencias

## 🚀 Acceso al Panel

### URL
```
http://localhost:3000/admin
```

### Requisitos
- Debes estar autenticado con un usuario que tenga rol `admin` o `host`
- Si intentas acceder sin permisos, serás redirigido a la página principal

## 👤 Crear Usuarios Admin/Host

### Opción 1: Desde la API (Recomendado)

Puedes crear usuarios admin o host haciendo una petición POST a:

```
POST /api/admin/create-user
```

**Headers:**
```
Authorization: Bearer {userId_del_admin}
Content-Type: application/json
```

**Body:**
```json
{
  "email": "admin@gentum.ar",
  "name": "Administrador",
  "role": "admin",
  "password": "tu_password_seguro"
}
```

Para crear un anfitrión:
```json
{
  "email": "host@gentum.ar",
  "name": "Anfitrión",
  "role": "host",
  "password": "tu_password_seguro"
}
```

### Opción 2: Crear manualmente en `data/usuarios.json`

Puedes agregar usuarios directamente en el archivo JSON:

```json
{
  "id": "1234567890",
  "email": "admin@gentum.ar",
  "name": "Administrador",
  "role": "admin",
  "createdAt": 1234567890,
  "password": "admin123"
}
```

## 🔐 Iniciar Sesión

1. Ve a `/login`
2. Ingresa el email y contraseña del usuario admin/host
3. Serás redirigido automáticamente al panel de administración

## 📊 Funcionalidades del Panel

### Dashboard
- Vista general con estadísticas del sistema
- Contadores de experiencias, grupos, posts, usuarios y reservas
- Estado de experiencias (pendientes, aprobadas)

### Gestión de Experiencias

**Para Administradores:**
- Ver todas las experiencias
- Crear nuevas experiencias
- Editar cualquier experiencia
- Eliminar experiencias
- Cambiar estado (pendiente, aprobada, rechazada)

**Para Anfitriones:**
- Ver solo sus propias experiencias
- Crear nuevas experiencias
- Editar solo sus experiencias
- Eliminar solo sus experiencias

### Gestión de Posts (Solo Admin)
- Ver todos los posts de la comunidad
- Editar posts
- Eliminar posts

### Gestión de Grupos (Solo Admin)
- Ver todos los grupos
- Editar grupos
- Eliminar grupos

### Gestión de Usuarios (Solo Admin)
- Ver todos los usuarios registrados
- Editar usuarios (cambiar rol, nombre, etc.)
- Eliminar usuarios (excepto el propio)

### Gestión de Reservas (Solo Admin)
- Ver todas las reservas
- Editar estado de reservas
- Eliminar reservas

## 🔧 APIs Disponibles

Todas las APIs de administración requieren autenticación mediante header:

```
Authorization: Bearer {userId}
```

### Experiencias
- `GET /api/admin/experiencias` - Listar experiencias
- `POST /api/admin/experiencias` - Crear experiencia
- `PUT /api/admin/experiencias` - Actualizar experiencia
- `DELETE /api/admin/experiencias?id={id}` - Eliminar experiencia

### Posts
- `GET /api/admin/posts` - Listar posts
- `PUT /api/admin/posts` - Actualizar post
- `DELETE /api/admin/posts?id={id}` - Eliminar post

### Grupos
- `GET /api/admin/grupos` - Listar grupos
- `PUT /api/admin/grupos` - Actualizar grupo
- `DELETE /api/admin/grupos?id={id}` - Eliminar grupo

### Usuarios
- `GET /api/admin/usuarios` - Listar usuarios
- `PUT /api/admin/usuarios` - Actualizar usuario
- `DELETE /api/admin/usuarios?id={id}` - Eliminar usuario
- `POST /api/admin/create-user` - Crear nuevo usuario (solo admin)

### Reservas
- `GET /api/admin/reservas` - Listar reservas
- `PUT /api/admin/reservas` - Actualizar reserva
- `DELETE /api/admin/reservas?id={id}` - Eliminar reserva

### Estadísticas
- `GET /api/admin/stats` - Obtener estadísticas del sistema

## 🎨 Interfaz

El panel tiene:
- **Sidebar de navegación**: Acceso rápido a todas las secciones
- **Vista de tablas**: Para listar y gestionar elementos
- **Modales de edición**: Para crear/editar contenido
- **Indicadores de estado**: Colores para estados (pendiente, aprobado, etc.)

## 🔒 Permisos y Seguridad

### Administrador
- Acceso completo a todas las funcionalidades
- Puede gestionar usuarios y asignar roles
- Puede aprobar/rechazar experiencias

### Anfitrión
- Solo puede ver y gestionar sus propias experiencias
- No puede acceder a gestión de usuarios, posts, grupos o reservas
- Puede crear nuevas experiencias que quedan en estado "pendiente"

## 📝 Notas Importantes

1. **Autenticación**: El sistema actual usa localStorage en el frontend y tokens simples en el backend. En producción, deberías implementar JWT reales.

2. **Contraseñas**: Las contraseñas se almacenan en texto plano. En producción, deben estar hasheadas (bcrypt, argon2, etc.).

3. **Validación**: Agrega validación de datos en producción (email válido, campos requeridos, etc.).

4. **Base de datos**: Actualmente usa archivos JSON. En producción, migra a una base de datos real (PostgreSQL, MongoDB, etc.).

## 🐛 Solución de Problemas

### No puedo acceder al panel
- Verifica que tu usuario tenga rol `admin` o `host`
- Asegúrate de estar autenticado
- Revisa la consola del navegador para errores

### Las APIs devuelven 401 (No autorizado)
- Verifica que el header `Authorization: Bearer {userId}` esté presente
- Asegúrate de que el userId corresponda a un usuario válido

### No veo mis experiencias (anfitrión)
- Verifica que las experiencias tengan `hostId` o `host.email` que coincida con tu usuario
- Las experiencias se filtran automáticamente por anfitrión

## 🚀 Próximos Pasos

- [ ] Implementar JWT real para autenticación
- [ ] Agregar hash de contraseñas
- [ ] Implementar validación de datos
- [ ] Agregar paginación para listas grandes
- [ ] Agregar búsqueda y filtros avanzados
- [ ] Implementar logs de auditoría
- [ ] Agregar exportación de datos (CSV, Excel)
- [ ] Implementar notificaciones en tiempo real

