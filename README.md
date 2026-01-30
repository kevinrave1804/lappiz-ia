# 🚀 Lappiz Chat Widget

Widget de chat conversacional desarrollado como Web Component para integrarse fácilmente en cualquier sitio web.

## 📋 Características

- ✅ **Web Component estándar** - Compatible con cualquier framework o sitio HTML
- ✅ **Self-contained** - No requiere dependencias externas
- ✅ **Shadow DOM** - Estilos completamente aislados
- ✅ **Singleton Pattern** - Una única instancia global del servicio
- ✅ **TypeScript** - Código tipado y seguro
- ✅ **Responsive** - Adaptado para móviles y desktop
- ✅ **CDN Ready** - Listo para distribución vía jsDelivr

## 🎯 Uso Rápido

### 1. Incluir el script desde CDN (GitHub + jsDelivr)

```html
<script src="https://cdn.jsdelivr.net/gh/tu-usuario/lappiz-chat-widget@1.0.0/dist/main.js"></script>
```

### 2. Agregar el elemento HTML

```html
<lappiz-chat agent-key="tu-agent-key-aqui" app-name="client_atention"> </lappiz-chat>
```

### 3. ¡Listo! 🎉

El widget aparecerá como un botón flotante en la esquina inferior derecha.

## 🔧 Atributos del Widget

| Atributo    | Tipo   | Requerido | Descripción                        | Default           |
| ----------- | ------ | --------- | ---------------------------------- | ----------------- |
| `agent-key` | string | ✅ Sí     | Clave de autenticación del agente  | -                 |
| `app-name`  | string | ❌ No     | Nombre de la aplicación del agente | `client_atention` |

> **Nota:** La URL de la API (`https://api.lappiz.com`) está configurada internamente en el widget.

## 🏗️ Desarrollo Local

### Prerrequisitos

- Node.js >= 18
- npm >= 9

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/lappiz-chat-widget.git
cd lappiz-chat-widget

# Instalar dependencias
npm install
```

### Comandos disponibles

```bash
# Iniciar servidor de desarrollo
npm start
# El widget estará disponible en http://localhost:4200

# Compilar para producción
npm run build:widget
# Output en /dist

# Ejecutar tests
npm test
```

### Probar el widget localmente

1. Ejecuta el servidor de desarrollo:

```bash
npm start
```

2. Abre `demo.html` en tu navegador

3. El widget se conectará a la URL de API configurada

## 📦 Build para Producción

```bash
npm run build:prod
```

Esto generará en `dist/browser/`:

- `main.js` - Bundle único optimizado
- `polyfills.js` - Polyfills necesarios
- `styles.css` - Estilos compilados
- Sin source maps
- Sin output hashing (para URLs consistentes en CDN)

## 🌐 Publicación en CDN (GitHub + jsDelivr)

### Preparar y publicar una nueva versión

```bash
# 1. Preparar el release (build + mostrar instrucciones)
npm run prepare-release

# 2. Seguir las instrucciones mostradas:
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

### URLs de jsDelivr (disponibles ~5 min después del push)

**Última versión (auto-actualizable):**

```
https://cdn.jsdelivr.net/gh/TU-USUARIO/lappiz-chat-widget@latest/dist/browser/main.js
```

**Versión específica (recomendado para producción):**

```
https://cdn.jsdelivr.net/gh/TU-USUARIO/lappiz-chat-widget@v1.0.0/dist/browser/main.js
```

### Ejemplo de uso desde CDN

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi Sitio Web</title>
  </head>
  <body>
    <h1>Mi Página</h1>

    <!-- Widget de Lappiz -->
    <lappiz-chat agent-key="6D23265D-11FD-4C11-972E-380E698D2912" color="#FF6B6B"> </lappiz-chat>

    <!-- Cargar desde jsDelivr CDN -->
    <script
      src="https://cdn.jsdelivr.net/gh/TU-USUARIO/lappiz-chat-widget@latest/dist/browser/main.js"
      type="module"
    ></script>
  </body>
</html>
```

### Para nuevas versiones

```bash
# Actualizar versión en package.json (1.0.0 → 1.0.1)
npm version patch  # o minor, o major

# Preparar release
npm run prepare-release

# Seguir instrucciones para git add, commit, tag y push
```

## 🎨 Personalización

El widget actualmente soporta personalización limitada. Los colores principales están definidos en el gradiente:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Para modificar los colores, edita los componentes en `src/app/components/`

## 📡 Integración con API

### Endpoints utilizados

#### 1. Crear Sesión

```
POST /apps/{app_name}/users/{user_id}/sessions?agent-key={agent_key}
```

El widget genera automáticamente un `user_id` único (UUID v4) cada vez que se carga la página.

#### 2. Enviar Mensaje

```
POST /run?agent-key={agent_key}
```

**Body:**

```json
{
  "appName": "client_atention",
  "userId": "user-abc123...",
  "sessionId": "session-xyz789...",
  "newMessage": {
    "role": "user",
    "parts": [{ "text": "Hola, necesito ayuda" }]
  }
}
```

## 🏛️ Arquitectura

### Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── lappiz-chat.component.ts       # Web Component principal
│   │   ├── chat-bubble.component.ts       # Botón flotante
│   │   ├── chat-header.component.ts       # Header del chat
│   │   ├── chat-messages.component.ts     # Lista de mensajes
│   │   └── chat-input.component.ts        # Input de texto
│   ├── services/
│   │   └── agent.service.ts               # Singleton - API calls
│   └── models/
│       └── interfaces.ts                  # TypeScript interfaces
├── main.ts                                # Entry point + Custom Element registration
└── styles.scss                            # Estilos globales
```

### Patrón Singleton

El `AgentService` implementa el patrón Singleton para asegurar:

- Una única instancia global
- Gestión centralizada de la sesión
- Estado compartido entre todos los componentes

```typescript
const agentService = AgentService.getInstance();
```

### Shadow DOM

El widget utiliza Shadow DOM para:

- Encapsulación completa de estilos
- Sin conflictos con CSS del sitio host
- Aislamiento total del widget

## 🐛 Debugging

### Consola del navegador

El widget emite logs útiles en la consola:

```
✅ Lappiz Chat Widget registrado exitosamente
✅ AgentService inicializado correctamente
```

### Errores comunes

**"Configuración incompleta"**

- Verifica que `api-url` y `agent-key` estén configurados

**"Error al conectar con el agente"**

- Verifica que la API esté accesible
- Revisa la consola del navegador para más detalles
- Verifica que el `agent-key` sea válido

## 📄 Licencia

Este proyecto es privado y propiedad de Lappiz.
