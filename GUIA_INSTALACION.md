# 📚 Guía Completa para Principiantes - Gentum.ar

## ¿Qué necesitás saber?

### ¿Qué es Node.js?
Node.js es un programa que permite ejecutar JavaScript en tu computadora (no solo en el navegador). Es como el "motor" que hace funcionar aplicaciones web modernas.

### ¿Qué es npm?
npm (Node Package Manager) es una herramienta que viene con Node.js. Se usa para instalar las "piezas" (librerías) que necesita tu proyecto para funcionar.

### ¿Qué es "npm install"?
Es el comando que le dice a npm: "Instalá todas las dependencias que este proyecto necesita". Las dependencias están listadas en el archivo `package.json`.

---

## 🚀 PASO A PASO COMPLETO

### PASO 1: Instalar Node.js

1. **Abrí tu navegador** (Chrome, Edge, Firefox, etc.)

2. **Andá a esta página**: https://nodejs.org/

3. **Vas a ver dos botones grandes**:
   - Uno dice "LTS" (Long Term Support) - **ELEGÍ ESTE**
   - Otro dice "Current" - No elijas este todavía

4. **Hacé clic en el botón LTS** (debería decir algo como "v20.x.x LTS")

5. **Se descargará un archivo** tipo `node-v20.x.x-x64.msi`

6. **Ejecutá ese archivo** (doble clic)

7. **En el instalador**:
   - Clic en "Next" varias veces
   - Aceptá los términos
   - Dejá todas las opciones marcadas como vienen por defecto
   - Clic en "Install"
   - Esperá a que termine
   - Clic en "Finish"

8. **MUY IMPORTANTE**: Cerrá y volvé a abrir PowerShell o la terminal que estés usando

### PASO 2: Verificar que se instaló bien

Después de cerrar y abrir PowerShell de nuevo, escribí estos comandos uno por uno:

```bash
node --version
```

Debería mostrar algo como: `v20.x.x`

Luego:

```bash
npm --version
```

Debería mostrar algo como: `10.x.x`

**Si ambos comandos muestran números, ¡está todo bien!** ✅

### PASO 3: Instalar las dependencias del proyecto

1. **Asegurate de estar en la carpeta del proyecto**:
   - En PowerShell, escribí: `cd C:\Users\Dario\Desktop\prueba`
   - O navegá hasta la carpeta usando el Explorador de Windows y hacé clic derecho → "Abrir en Terminal"

2. **Instalá las dependencias**:
   ```bash
   npm install
   ```

3. **Esto va a tardar unos minutos** (2-5 minutos normalmente)
   - Vas a ver muchas líneas de texto pasando
   - Es normal, no te preocupes
   - Cuando termine, deberías ver algo como: "added 500 packages"

### PASO 4: Ejecutar el proyecto

Una vez que termine `npm install`, escribí:

```bash
npm run dev
```

Vas a ver algo como:
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

### PASO 5: Ver tu aplicación

1. **Abrí tu navegador** (Chrome, Edge, etc.)

2. **Andá a esta dirección**: http://localhost:3000

3. **¡Deberías ver la página de Gentum.ar!** 🎉

---

## ❓ Problemas Comunes

### "npm no se reconoce como comando"
- **Solución**: No instalaste Node.js o no cerraste y abriste PowerShell de nuevo
- **Hacé**: Instalá Node.js de nuevo y reiniciá PowerShell

### "Error al instalar dependencias"
- **Solución**: A veces pasa por conexión a internet
- **Hacé**: Intentá de nuevo con `npm install`

### "Puerto 3000 ya está en uso"
- **Solución**: Ya hay algo corriendo en ese puerto
- **Hacé**: Cerrá otras aplicaciones o cambiá el puerto

### "No puedo abrir localhost:3000"
- **Solución**: Asegurate de que `npm run dev` esté corriendo
- **Hacé**: Volvé a PowerShell y verificá que no haya errores

---

## 📱 Para la App Móvil (Opcional - más adelante)

La app móvil necesita Expo. Pero primero terminá de probar la versión web, que es más simple.

---

## 💡 Consejos

1. **No cierres PowerShell** mientras `npm run dev` esté corriendo
2. **Cada vez que quieras ver la app**, solo necesitás escribir `npm run dev`
3. **Si cambiás algo en el código**, la página se actualiza sola (hot reload)
4. **Para detener la app**, presioná `Ctrl + C` en PowerShell

---

## 🎯 Resumen Rápido

1. Instalá Node.js desde nodejs.org (versión LTS)
2. Reiniciá PowerShell
3. Andá a la carpeta del proyecto
4. Escribí: `npm install`
5. Esperá a que termine
6. Escribí: `npm run dev`
7. Abrí http://localhost:3000 en tu navegador

¡Eso es todo! 🚀




