import { Injectable } from '@angular/core';
import {
  Session,
  AgentResponse,
  RunAgentRequest,
  Message,
  WidgetConfig,
} from '../models/interfaces';

/**
 * Servicio Singleton para manejar la comunicación con la API del agente
 * Mantiene una única instancia global para gestionar la sesión
 */
@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private static instance: AgentService | null = null;

  private sessionId: string | null = null;
  private userId: string | null = null;
  private config: WidgetConfig | null = null;
  private messages: Message[] = [];
  private isInitialized = false;

  private constructor() {
    // Constructor privado para patrón Singleton
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): AgentService {
    if (!AgentService.instance) {
      AgentService.instance = new AgentService();
    }
    return AgentService.instance;
  }

  /**
   * Inicializa el servicio con la configuración del widget
   * Crea una nueva sesión en el backend
   */
  public async initialize(config: WidgetConfig): Promise<void> {
    if (this.isInitialized) {
      console.warn('AgentService ya está inicializado');
      return;
    }

    this.config = config;
    this.userId = this.generateUserId();

    try {
      await this.createSession();
      this.isInitialized = true;
      console.log('AgentService inicializado correctamente', {
        userId: this.userId,
        sessionId: this.sessionId,
      });
    } catch (error) {
      console.error('Error al inicializar AgentService:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva sesión en el backend
   */
  private async createSession(): Promise<void> {
    if (!this.config) {
      throw new Error('Config no está definido');
    }

    const url = `${this.config.apiUrl}/apps/${this.config.appName}/users/${this.userId}/sessions`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error(`Error al crear sesión: ${response.status} ${response.statusText}`);
      }

      const session: Session = await response.json();
      this.sessionId = session.id;
      this.userId = session.userId;

      console.log('Sesión creada exitosamente:', session);
    } catch (error) {
      console.error('Error en createSession:', error);
      throw error;
    }
  }

  /**
   * Envía un mensaje al agente y retorna la respuesta
   */
  public async sendMessage(
    messageText: string
  ): Promise<Message> {
    if (!this.isInitialized || !this.config || !this.sessionId || !this.userId) {
      throw new Error('AgentService no está inicializado correctamente');
    }

    const userMessage: Message = {
      role: 'user',
      text: messageText,
      timestamp: Date.now(),
    };
    this.messages.push(userMessage);

    const requestBody: RunAgentRequest = {
      appName: this.config.appName,
      userId: this.userId,
      sessionId: this.sessionId,
      newMessage: {
        role: 'user',
        parts: [{ text: messageText }],
      },
      state_delta: {
        agent_key: this.config.agentKey
      }
    };

    try {
      const url = `${this.config.apiUrl}/run`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Error al enviar mensaje: ${response.status} ${response.statusText}`);
      }

      const agentResponses: AgentResponse[] = await response.json();
      console.log('Respuesta del API:', agentResponses);

      // Buscar el objeto de respuesta que contiene el content
      const agentResponse = agentResponses.find(response => response.content);
      console.log('Respuesta con content encontrada:', agentResponse);

      if (!agentResponse) {
        throw new Error('No se encontró respuesta con contenido del agente');
      }

      // Buscar el part que contiene el texto (puede haber múltiples parts)
      const textPart = agentResponse.content.parts.find(part => part.text);
      const agentMessageText = textPart?.text || '';
      console.log('Texto extraído de la respuesta:', agentMessageText);

      const agentMessage: Message = {
        role: 'model',
        text: agentMessageText,
        timestamp: agentResponse.timestamp * 1000,
      };

      this.messages.push(agentMessage);
      console.log('Mensajes actuales en el servicio:', this.messages);

      return agentMessage;
    } catch (error) {
      console.error('Error en sendMessage:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de mensajes
   */
  public getMessages(): Message[] {
    return [...this.messages];
  }

  /**
   * Limpia el historial de mensajes (sin eliminar la sesión)
   */
  public clearMessages(): void {
    this.messages = [];
  }

  /**
   * Genera un userId único usando UUID v4
   */
  private generateUserId(): string {
    return 'user-' + this.uuidv4();
  }

  /**
   * Genera un UUID v4
   */
  private uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Verifica si el servicio está inicializado
   */
  public get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Reinicia el servicio (útil para testing o recargas)
   */
  public async reset(): Promise<void> {
    this.sessionId = null;
    this.userId = null;
    this.messages = [];
    this.isInitialized = false;

    if (this.config) {
      await this.initialize(this.config);
    }
  }
}
