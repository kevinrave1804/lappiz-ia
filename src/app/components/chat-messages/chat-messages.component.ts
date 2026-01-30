import { Component, Input, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../models/interfaces';

/**
 * Componente que muestra la lista de mensajes del chat
 */
@Component({
    selector: 'chat-messages',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './chat-messages.component.html',
    styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements AfterViewChecked {
    @Input() messages: Message[] = [];
    @Input() isTyping = false;

    @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
    private shouldScrollToBottom = false;

    ngAfterViewChecked(): void {
        if (this.shouldScrollToBottom) {
            this.scrollToBottom();
            this.shouldScrollToBottom = false;
        }
    }

    ngOnChanges(): void {
        this.shouldScrollToBottom = true;
    }

    private scrollToBottom(): void {
        try {
            if (this.messagesContainer) {
                const element = this.messagesContainer.nativeElement;
                element.scrollTop = element.scrollHeight;
            }
        } catch (err) {
            console.error('Error al hacer scroll:', err);
        }
    }

    formatTime(timestamp: number): string {
        const date = new Date(timestamp);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}
