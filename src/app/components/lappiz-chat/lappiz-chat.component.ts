import {
  Component,
  OnInit,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentService } from '../../services/agent.service';
import { Message, WidgetConfig } from '../../models/interfaces';
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component';
import { ChatHeaderComponent } from '../chat-header/chat-header.component';
import { ChatMessagesComponent } from '../chat-messages/chat-messages.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';
import { environment } from '../../../environments/environment';

/**
 * Componente principal del Widget de Chat (Web Component)
 * Este componente se registrará como Custom Element <lappiz-chat>
 */
@Component({
  selector: 'lappiz-chat',
  standalone: true,
  imports: [
    CommonModule,
    ChatBubbleComponent,
    ChatHeaderComponent,
    ChatMessagesComponent,
    ChatInputComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './lappiz-chat.component.html',
  styleUrls: ['./lappiz-chat.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class LappizChatComponent implements OnInit {
  // URL de la API configurada desde environment
  private readonly API_URL = environment.apiUrl;

  // Atributos del Custom Element
  @Input('agent-key') agentKey = '';
  @Input('color') primaryColor = '#667eea';

  // App name es siempre por defecto
  private readonly appName = 'client_atention';

  @ViewChild('chatInput') chatInputComponent?: ChatInputComponent;

  isOpen = false;
  messages: Message[] = [];
  isTyping = false;
  errorMessage = '';

  private agentService: AgentService;

  constructor(private cdr: ChangeDetectorRef) {
    this.agentService = AgentService.getInstance();
  }

  async ngOnInit(): Promise<void> {
    await this.initializeWidget();
    this.applyCustomColor();
  }

  private applyCustomColor(): void {
    // Aplicar el color personalizado como variable CSS
    const host = document.querySelector('lappiz-chat');
    if (host && host.shadowRoot) {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        :host {
          --primary-color: ${this.primaryColor};
        }
      `;
      host.shadowRoot.appendChild(styleElement);
    }
  }

  private async initializeWidget(): Promise<void> {
    // Validar configuración
    if (!this.agentKey) {
      this.showError('Configuración incompleta: agent-key es requerido');
      return;
    }

    const config: WidgetConfig = {
      apiUrl: this.API_URL,
      agentKey: this.agentKey,
      appName: this.appName,
    };

    try {
      // Inicializar el servicio si no está inicializado
      if (!this.agentService.initialized) {
        await this.agentService.initialize(config);
      }

      // Cargar mensajes existentes
      this.messages = this.agentService.getMessages();
    } catch (error) {
      console.error('Error al inicializar widget:', error);
      this.showError('Error al conectar con el agente. Intenta de nuevo más tarde.');
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  async handleSendMessage(messageText: string): Promise<void> {
    if (!messageText.trim()) {
      return;
    }

    // Crear el mensaje del usuario inmediatamente
    const userMessage: Message = {
      role: 'user',
      text: messageText,
      timestamp: Date.now(),
    };

    // Agregar el mensaje del usuario al array para mostrarlo de inmediato
    this.messages = [...this.messages, userMessage];
    this.cdr.detectChanges();

    // Deshabilitar input y activar indicador de escritura
    this.isTyping = true;
    if (this.chatInputComponent) {
      this.chatInputComponent.setDisabled(true);
    }

    try {
      // Enviar mensaje al agente y esperar respuesta
      const agentMessage = await this.agentService.sendMessage(messageText);

      // Agregar la respuesta del agente
      this.messages = [...this.messages, agentMessage];
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      this.showError('Error al enviar mensaje. Intenta de nuevo.');
    } finally {
      this.isTyping = false;
      if (this.chatInputComponent) {
        this.chatInputComponent.setDisabled(false);
      }
      this.cdr.detectChanges();
    }
  }

  private showError(message: string): void {
    this.errorMessage = message;

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.clearError();
    }, 5000);
  }

  clearError(): void {
    this.errorMessage = '';
  }
}
