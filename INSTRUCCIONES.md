# Instrucciones para Ejecutar Gentum.ar

## 🚀 Versión Web (Next.js)

### Pasos para iniciar:

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   - La aplicación estará disponible en: `http://localhost:3000`

### Pantallas disponibles:

- **Landing**: `http://localhost:3000/`
- **Experiencias**: `http://localhost:3000/experiencias`
- **Detalle de Experiencia**: `http://localhost:3000/experiencias/1`
- **Crear Grupo**: `http://localhost:3000/grupos/crear`
- **Chat de Grupo**: `http://localhost:3000/grupos/1`

## 📱 Versión Móvil (React Native con Expo)

### Pasos para iniciar:

1. **Navegar a la carpeta de la app móvil:**
   ```bash
   cd app-mobile
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar Expo:**
   ```bash
   npm start
   ```

4. **Opciones de ejecución:**
   - Presiona `i` para iOS Simulator (requiere Xcode en Mac)
   - Presiona `a` para Android Emulator (requiere Android Studio)
   - Escanea el QR con la app Expo Go en tu teléfono
   - Presiona `w` para abrir en navegador web

## 🎨 Características Implementadas

### Web:
✅ Landing page completa con todas las secciones
✅ Feed de experiencias con filtros
✅ Ficha detallada de experiencia
✅ Wizard de creación de grupos (3 pasos)
✅ Chat de grupo funcional
✅ Diseño responsive (mobile-first)
✅ Paleta de colores de la marca

### App Móvil:
✅ Estructura base con navegación por tabs
✅ 5 pantallas principales (Inicio, Experiencias, Grupos, Comunidad, Perfil)
✅ Navegación funcional
✅ Iconos y estilos básicos

## 📝 Notas Importantes

- **Datos mock**: Todas las experiencias, grupos y mensajes son datos de ejemplo (mock data)
- **Sin backend**: Por ahora no hay conexión a base de datos ni API
- **Sin autenticación**: Las funcionalidades de login/registro están pendientes
- **Responsive**: La versión web está optimizada para mobile, tablet y desktop

## 🔄 Próximos Pasos de Desarrollo

1. Implementar backend (API REST)
2. Base de datos (PostgreSQL)
3. Sistema de autenticación
4. Integración de pagos
5. Completar pantallas de la app móvil
6. Sistema de notificaciones
7. Panel de administración

## 🐛 Solución de Problemas

### Error al instalar dependencias:
```bash
# Limpiar cache de npm
npm cache clean --force
# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Puerto 3000 ocupado:
```bash
# Cambiar puerto en package.json o usar:
PORT=3001 npm run dev
```

### Problemas con Expo:
```bash
# Limpiar cache de Expo
expo start -c
```

## 📞 Soporte

Para cualquier duda o problema, revisa el README.md principal o contacta al equipo de desarrollo.




