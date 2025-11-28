# Diagnóstico de Problemas

Si la aplicación no está funcionando, sigue estos pasos:

## 1. Verificar que el servidor esté corriendo

Abre una terminal PowerShell y ejecuta:

```powershell
cd C:\Users\Dario\Desktop\prueba
npm run dev
```

Deberías ver algo como:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

## 2. Verificar errores en la consola del navegador

1. Abre el navegador (Chrome/Edge)
2. Presiona F12 para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Busca errores en rojo

## 3. Errores comunes y soluciones

### Error: "Cannot find module"
- **Solución**: Ejecuta `npm install` en la terminal

### Error: "Hydration failed"
- **Solución**: Ya está corregido en el código, recarga la página

### Error: "localStorage is not defined"
- **Solución**: Ya está corregido, el código verifica `typeof window !== 'undefined'`

### La página está en blanco
- **Solución**: 
  1. Abre la consola del navegador (F12)
  2. Mira qué error aparece
  3. Recarga la página (Ctrl+R o F5)

## 4. Limpiar caché

Si nada funciona, limpia el caché:

1. En el navegador, presiona Ctrl+Shift+Delete
2. Selecciona "Caché" y "Cookies"
3. Limpia todo
4. Recarga la página

## 5. Verificar que los archivos estén guardados

Asegúrate de que todos los archivos estén guardados en tu editor.

## 6. Reiniciar el servidor

1. En la terminal donde corre `npm run dev`, presiona Ctrl+C
2. Ejecuta `npm run dev` nuevamente

## Contacto

Si el problema persiste, comparte:
- El error exacto de la consola del navegador
- Una captura de pantalla
- Qué página no está funcionando

