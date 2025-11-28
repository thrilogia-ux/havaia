# Gentum.ar - Plataforma de Experiencias para la Comunidad Israelí en Argentina

## Descripción

Gentum.ar es una plataforma web y móvil diseñada para conectar a israelíes que viajan a Argentina con experiencias auténticas, curadas y seguras. La plataforma combina un marketplace de experiencias, herramientas de gestión de grupos y una comunidad activa.

## Características Principales

- **Marketplace de Experiencias**: Catálogo curado de actividades en Buenos Aires (expandible a otras provincias)
- **Gestión de Grupos**: Creación y coordinación de grupos personalizados con cupos configurables
- **Comunidad**: Foros, chats y conexión entre viajeros
- **Anfitriones Verificados**: Sistema de verificación y calificaciones
- **Soporte 24/7**: Asistencia bilingüe (hebreo/español/inglés)

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons
- **Próximamente**: React Native para app móvil

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## Estructura del Proyecto

```
gentum-ar/
├── app/                    # Rutas y páginas (Next.js App Router)
│   ├── page.tsx           # Landing page
│   ├── experiencias/      # Páginas de experiencias
│   ├── grupos/            # Páginas de grupos
│   └── layout.tsx         # Layout principal
├── components/             # Componentes reutilizables
│   └── Header.tsx         # Header de navegación
├── public/                 # Archivos estáticos
└── package.json           # Dependencias
```

## Pantallas Implementadas

### Web
- ✅ Landing page
- ✅ Feed de experiencias
- ✅ Ficha de experiencia detallada
- ✅ Crear grupo (wizard de 3 pasos)
- ✅ Chat de grupo

### Próximamente
- Panel interno (staff/curadores)
- Perfil de usuario
- Foros comunitarios
- Sistema de pagos
- App móvil (React Native)

## Colores de la Marca

- **Primary (Azul)**: `#0066cc` - Confianza y profesionalismo
- **Secondary (Celeste)**: `#00a085` - Frescura y conexión
- **Accent (Naranja)**: `#ff8c00` - Energía y experiencias

## Próximos Pasos

1. Implementar backend (API REST)
2. Sistema de autenticación
3. Base de datos (PostgreSQL)
4. Integración de pagos
5. App móvil con React Native
6. Sistema de notificaciones push
7. Panel de administración completo

## Licencia

Privado - Gentum.ar © 2024




