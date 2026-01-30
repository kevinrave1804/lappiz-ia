import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';
import { LappizChatComponent } from './app/components/lappiz-chat/lappiz-chat.component';

/**
 * Inicialización del Widget como Web Component (Custom Element)
 * Este código registra el elemento <lappiz-chat> para ser usado en cualquier página
 */
(async () => {
  try {
    // Crear aplicación Angular
    const app = await createApplication({
      providers: [],
    });

    // Convertir el componente Angular en Custom Element
    const chatElement = createCustomElement(LappizChatComponent, {
      injector: app.injector,
    });

    // Registrar el Custom Element en el navegador
    if (!customElements.get('lappiz-chat')) {
      customElements.define('lappiz-chat', chatElement);
      console.log('✅ Lappiz Chat Widget registrado exitosamente');
    }
  } catch (error) {
    console.error('❌ Error al registrar Lappiz Chat Widget:', error);
  }
})();
