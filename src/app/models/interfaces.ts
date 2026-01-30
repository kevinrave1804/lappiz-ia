/**
 * Interfaz para la configuración del widget
 */
export interface WidgetConfig {
  apiUrl: string;
  agentKey: string;
  appName: string;
}

/**
 * Interfaz para el mensaje del usuario o agente
 */
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

/**
 * Interfaz para la parte del mensaje (API)
 */
export interface MessagePart {
  text: string;
}

/**
 * Interfaz para el nuevo mensaje que se envía a la API
 */
export interface NewMessage {
  role: 'user';
  parts: MessagePart[];
}

/**
 * Interfaz para el contenido de la respuesta del agente
 */
export interface AgentResponseContent {
  parts: MessagePart[];
  role: 'model';
}

/**
 * Interfaz para la respuesta completa del agente
 */
export interface AgentResponse {
  content: AgentResponseContent;
  groundingMetadata?: any;
  finishReason: string;
  usageMetadata?: any;
  avgLogprobs?: number;
  invocationId: string;
  author: string;
  actions?: any;
  id: string;
  timestamp: number;
}

/**
 * Interfaz para la sesión creada
 */
export interface Session {
  id: string;
  appName: string;
  userId: string;
  state: any;
  events: any[];
  lastUpdateTime: number;
}

/**
 * Interfaz para el body del endpoint /run
 */
export interface RunAgentRequest {
  appName: string;
  userId: string;
  sessionId: string;
  newMessage: NewMessage;
  state_delta?: {
    instructions?: string;
    knowledge?: string;
    rag_corpus?: string;
    agent_key?: string;
  };
}
