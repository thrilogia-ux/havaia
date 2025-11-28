# 🔍 Cómo Ver el Backend

## 📍 Ubicación del Backend

El backend está en la carpeta `app/api/` y usa Next.js API Routes.

### Estructura:
```
app/api/
├── auth/
│   ├── login/route.ts
│   └── register/route.ts
├── experiencias/route.ts
├── grupos/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── mensajes/route.ts
├── posts/route.ts
├── payments/checkout/route.ts
└── reservas/route.ts
```

## 🌐 Cómo Probar el Backend

### 1. Desde el Navegador

Abre estas URLs en tu navegador (con el servidor corriendo en `http://localhost:3000`):

#### Ver Experiencias:
```
http://localhost:3000/api/experiencias
```

#### Ver Posts de la Comunidad:
```
http://localhost:3000/api/posts
```

#### Ver Grupos:
```
http://localhost:3000/api/grupos
```

### 2. Desde la Consola del Navegador (F12)

Abre las herramientas de desarrollador (F12) y en la consola ejecuta:

```javascript
// Ver experiencias
fetch('/api/experiencias')
  .then(r => r.json())
  .then(data => console.log(data))

// Ver posts
fetch('/api/posts')
  .then(r => r.json())
  .then(data => console.log(data))

// Ver grupos
fetch('/api/grupos')
  .then(r => r.json())
  .then(data => console.log(data))
```

### 3. Usando Postman o Thunder Client

Si tienes Postman o Thunder Client (extensión de VS Code):

- **GET** `http://localhost:3000/api/experiencias`
- **GET** `http://localhost:3000/api/posts`
- **GET** `http://localhost:3000/api/grupos`
- **POST** `http://localhost:3000/api/posts` (con body JSON)

### 4. Desde PowerShell (usando curl)

```powershell
# Ver experiencias
Invoke-WebRequest -Uri "http://localhost:3000/api/experiencias" | Select-Object -ExpandProperty Content

# Ver posts
Invoke-WebRequest -Uri "http://localhost:3000/api/posts" | Select-Object -ExpandProperty Content
```

## 💾 Ver los Datos Almacenados

Los datos se guardan en archivos JSON en la carpeta `data/`:

```
data/
├── experiencias.json
├── grupos.json
├── usuarios.json
├── mensajes.json
├── posts.json
├── subscriptions.json
└── reservas.json
```

### Ver los archivos:

1. **Desde el explorador de archivos:**
   - Ve a `C:\Users\Dario\Desktop\prueba\data\`
   - Abre cualquier archivo `.json` con un editor de texto

2. **Desde VS Code:**
   - Abre la carpeta `data/` en el explorador
   - Click en cualquier archivo `.json` para verlo

3. **Desde PowerShell:**
   ```powershell
   # Ver experiencias
   Get-Content data\experiencias.json
   
   # Ver posts
   Get-Content data\posts.json
   ```

## 📡 Endpoints Disponibles

### Experiencias
- `GET /api/experiencias` - Ver todas
- `GET /api/experiencias?category=Gastronomía` - Filtrar
- `POST /api/experiencias` - Crear nueva

### Posts (Comunidad)
- `GET /api/posts` - Ver todos
- `GET /api/posts?category=Gastronomía` - Filtrar
- `POST /api/posts` - Crear nuevo

### Grupos
- `GET /api/grupos` - Ver todos
- `GET /api/grupos/1` - Ver grupo específico
- `POST /api/grupos` - Crear grupo

### Mensajes
- `GET /api/grupos/1/mensajes` - Ver mensajes de un grupo
- `POST /api/grupos/1/mensajes` - Enviar mensaje

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

## 🔧 Código del Backend

El código está en:
- **Lógica de base de datos:** `lib/db.ts`
- **Rutas API:** `app/api/*/route.ts`

## ⚠️ Nota

Si la carpeta `data/` no existe, se creará automáticamente cuando uses el backend por primera vez.

