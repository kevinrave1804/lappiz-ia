import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Componente del input para enviar mensajes
 */
@Component({
    selector: 'chat-input',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './chat-input.component.html',
    styleUrls: ['./chat-input.component.scss'],
})
export class ChatInputComponent {
    @Output() sendMessage = new EventEmitter<string>();

    inputValue = '';
    disabled = false;
    placeholder = 'Escribe tu mensaje...';

    handleSubmit(event: Event): void {
        event.preventDefault();

        const message = this.inputValue.trim();
        if (message && !this.disabled) {
            this.sendMessage.emit(message);
            this.inputValue = '';
        }
    }

    setDisabled(disabled: boolean): void {
        this.disabled = disabled;
    }

    setPlaceholder(placeholder: string): void {
        this.placeholder = placeholder;
    }
}
