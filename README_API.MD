## **Crear sesión del agente**

**Tipo de petición:**
`POST`

**Endpoint:**
`/apps/{app_name}/users/{user_id}/sessions`

**Descripción:**
Crea una nueva sesión para un usuario específico en una aplicación de agente. La sesión es necesaria para mantener el contexto de conversación y el estado del agente.

---

### **Parámetros**

**Path params:**

- `app_name` _(string)_
  Nombre de la aplicación del agente. Valores permitidos: `client_atention` o `rag_agent`

- `user_id` _(string)_
  Identificador único del usuario que utilizará la sesión. (Puede ser cualquier valor alfanumerico)

---

**Query params:**

No aplica

**Ejemplo de URL completa:**

```
POST /apps/client_atention/users/user123/sessions
```

---

### **Body**

```json
{}
```

- El body es un objeto JSON vacío.
- El body es obligatorio aunque esté vacío.

---

### **Response**

```json
{
  "id": "2cd6f373-bbb5-462c-9279-710042b834ca",
  "appName": "client_atention",
  "userId": "user123",
  "state": {},
  "events": [],
  "lastUpdateTime": 1769617407.6143775
}
```

**Descripción del response:**

- `id`: ID único de la sesión creada **(CRÍTICO: guardar para usar en endpoint de ejecución)**
- `appName`: Nombre de la aplicación del agente
- `userId`: ID del usuario **(CRÍTICO: guardar para usar en endpoint de ejecución)**
- `state`: Estado actual de la sesión (inicialmente vacío)
- `events`: Lista de eventos de la sesión (inicialmente vacía)
- `lastUpdateTime`: Timestamp de la última actualización

**Códigos de estado:**

- `200`: Sesión creada exitosamente
- `400`: Parámetros inválidos
- `500`: Error del servidor

---

### **Notas / Reglas importantes**

- **IMPORTANTE:** Guardar el `id` (sessionId) y `userId` del response, ya que son obligatorios para ejecutar el agente.
- Cada usuario puede tener múltiples sesiones activas.
- La sesión mantiene el historial de conversación y el estado del agente.
- Se recomienda crear una nueva sesión por cada conversación independiente.

---

## **Ejecutar agente**

**Tipo de petición:**
`POST`

**Endpoint:**
`/run`

**Descripción:**
Ejecuta el agente con un mensaje del usuario y opcionalmente actualiza el estado del agente (instrucciones, conocimientos, corpus RAG). Este endpoint procesa el mensaje y retorna la respuesta generada por el agente.

---

### **Parámetros**

**Path params:**

No aplica

---

**Query params:**

No aplica

---

### **Body**

```json
{
  "appName": "client_atention",
  "userId": "user123",
  "sessionId": "2cd6f373-bbb5-462c-9279-710042b834ca",
  "newMessage": {
    "role": "user",
    "parts": [
      {
        "text": "¿Cuáles son los horarios de atención?"
      }
    ]
  },
  "state_delta": {
    "instructions": "Eres un asistente de atención al cliente amable y profesional",
    "knowledge": "Horarios: Lunes a Viernes 9am-6pm, Sábados 10am-2pm",
    "rag_corpus": "corpus-lappiz-ia"
  }
}
```

**Campos del body:**

- `appName` _(string, obligatorio)_: Nombre de la aplicación (`client_atention` o `rag_agent`)
- `userId` _(string, obligatorio)_: ID del usuario (obtenido al crear la sesión)
- `sessionId` _(string, obligatorio)_: ID de la sesión (obtenido al crear la sesión)
- `newMessage` _(object, obligatorio)_: Mensaje del usuario
  - `role` _(string)_: Siempre debe ser `"user"`
  - `parts` _(array)_: Array con las partes del mensaje
    - `text` _(string)_: Contenido del mensaje del usuario
- `state_delta` _(object, opcional)_: Actualización del estado del agente
  - `instructions` _(string, opcional)_: Instrucciones de comportamiento del agente
  - `knowledge` _(string, opcional)_: Conocimientos o contexto adicional que el agente debe considerar
  - `rag_corpus` _(string, opcional)_: Nombre del corpus RAG a utilizar (para pruebas: `corpus-lappiz-ia`)

---

### **Response**

```json
[
  {
    "content": {
      "parts": [
        {
          "text": "¡Claro! Nuestros horarios de atención son de Lunes a Viernes de 9am a 6pm, y Sábados de 10am a 2pm. ¿En qué más puedo ayudarte?"
        }
      ],
      "role": "model"
    },
    "groundingMetadata": {},
    "finishReason": "STOP",
    "usageMetadata": {},
    "avgLogprobs": -0.36822914782865546,
    "invocationId": "e-ea557844-9911-43d8-8ce4-4f5dd2e9fc58",
    "author": "root_agent",
    "actions": {
      "stateDelta": {},
      "artifactDelta": {},
      "requestedAuthConfigs": {},
      "requestedToolConfirmations": {}
    },
    "id": "7b669dbe-8753-40ae-8da9-e7a951869e9c",
    "timestamp": 1769613123.797289
  }
]
```

**Descripción del response:**

El response es un **array** que contiene un objeto con la información completa de la ejecución:

**Campos principales:**

- `content`: Contenido de la respuesta del agente
  - `parts`: Array con las partes de la respuesta
    - `text`: Texto de la respuesta generada por el agente **(ESTE ES EL MENSAJE DE RESPUESTA PRINCIPAL)**
  - `role`: Rol del mensaje (siempre "model" para respuestas del agente)

- `groundingMetadata`: Metadata sobre el grounding RAG (solo para agente `rag_agent`)
- `usageMetadata`: Metadata de uso de tokens
- `finishReason`: Razón de finalización ("STOP" = completado exitosamente)
- `id`: ID único del mensaje de respuesta
- `timestamp`: Timestamp de la respuesta (Unix timestamp)
- `author`: Autor de la respuesta (generalmente "root_agent")
- `actions`: Acciones y cambios de estado del agente

**Códigos de estado:**

- `200`: Ejecución exitosa
- `400`: Parámetros inválidos o faltantes
- `404`: Sesión no encontrada
- `500`: Error del servidor o del agente
- `500`: Error del servidor o del agente

---

### **Notas / Reglas importantes**

- El `sessionId` y `userId` deben coincidir con los obtenidos al crear la sesión.
- El campo `state_delta` es opcional, pero permite personalizar el comportamiento del agente por ejecución.
- Para agentes RAG (`rag_agent`), es importante especificar `rag_corpus` en el `state_delta`.
- El agente mantiene el historial de conversación dentro de la sesión.
- Para testing, usar `rag_corpus: "corpus-lappiz-ia"` en el `state_delta`.
- El campo `instructions` en `state_delta` permite modificar dinámicamente el comportamiento del agente.
