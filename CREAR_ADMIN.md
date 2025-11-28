# 🔑 Cómo Crear un Usuario Administrador

## Método 1: Editar el archivo directamente (Más Rápido)

1. Abre el archivo `data/usuarios.json`
2. Agrega un nuevo usuario con rol `admin`:

```json
{
  "id": "admin-001",
  "email": "admin@gentum.ar",
  "name": "Administrador",
  "role": "admin",
  "createdAt": 1700000000000,
  "password": "admin123"
}
```

3. Guarda el archivo
4. Ve a `/login` e inicia sesión con:
   - Email: `admin@gentum.ar`
   - Password: cualquier cosa (por ahora no se valida)

## Método 2: Usar la consola del navegador

1. Abre la consola del navegador (F12)
2. Ejecuta este código:

```javascript
// Crear usuario admin
const adminUser = {
  id: 'admin-' + Date.now(),
  email: 'admin@gentum.ar',
  name: 'Administrador',
  role: 'admin',
  createdAt: Date.now()
}

// Guardar en localStorage temporalmente
localStorage.setItem('gentum_user', JSON.stringify(adminUser))

// Recargar la página
window.location.href = '/admin'
```

## Método 3: Desde la API (Requiere estar autenticado como admin)

Si ya tienes un admin, puedes crear más usuarios desde el panel o usando la API:

```bash
POST /api/admin/create-user
Authorization: Bearer {userId_del_admin}
Content-Type: application/json

{
  "email": "nuevo-admin@gentum.ar",
  "name": "Nuevo Admin",
  "role": "admin",
  "password": "password123"
}
```

## Usuarios Pre-configurados

Ya he agregado dos usuarios de prueba al archivo `data/usuarios.json`:

### Administrador
- **Email**: `admin@gentum.ar`
- **Password**: Cualquier cosa (no se valida aún)
- **Rol**: `admin`

### Anfitrión
- **Email**: `host@gentum.ar`
- **Password**: Cualquier cosa (no se valida aún)
- **Rol**: `host`

## ⚠️ Nota Importante

Actualmente el sistema de login no valida contraseñas. Cualquier email/password funcionará si el usuario existe en `data/usuarios.json`. 

En producción, deberías:
- Implementar hash de contraseñas (bcrypt)
- Validar contraseñas en el login
- Usar JWT para autenticación

