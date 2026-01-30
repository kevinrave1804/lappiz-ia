import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Componente del header del chat
 */
@Component({
    selector: 'chat-header',
    standalone: true,
    templateUrl: './chat-header.component.html',
    styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent {
    @Output() closeChat = new EventEmitter<void>();

    handleClose(): void {
        this.closeChat.emit();
    }
}
