import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Componente del botón flotante que abre/cierra el chat
 */
@Component({
    selector: 'chat-bubble',
    standalone: true,
    templateUrl: './chat-bubble.component.html',
    styleUrls: ['./chat-bubble.component.scss'],
})
export class ChatBubbleComponent {
    @Output() toggleChat = new EventEmitter<void>();

    handleClick(): void {
        this.toggleChat.emit();
    }
}
