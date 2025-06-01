import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="card">
      <h2>🤖 Chatbot IA</h2>
      <textarea [(ngModel)]="userPrompt" rows="3" placeholder="Posez votre question..." class="w-full p-inputtext mb-2"></textarea>
      <button class="p-button p-button-primary" (click)="sendPrompt()" [disabled]="loading">
        {{ loading ? 'Chargement...' : 'Envoyer' }}
      </button>

      <div *ngIf="botResponse" class="mt-3 p-3 border border-primary border-round">
        <strong>Réponse :</strong>
        <p style="white-space: pre-wrap;">{{ botResponse }}</p>
      </div>
    </div>
  `
})
export class ChatbotComponent {
  userPrompt: string = '';
  botResponse: string = '';
  loading = false;

  sendPrompt() {
    if (!this.userPrompt.trim()) return;

    // ✅ Ajout automatique pour réponse courte si "urgent"
    let promptToSend = this.userPrompt;
    if (promptToSend.toLowerCase().includes('urgent')) {
      promptToSend += ' (réponse courte, 3 points maximum)';
    }

    this.botResponse = '';
    this.loading = true;

    fetch('http://localhost:8000/recommend_action_stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptToSend })
    }).then(response => {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const read = () => {
        if (!reader) return;
        reader.read().then(({ done, value }) => {
          if (done) {
            this.loading = false;
            return;
          }
          this.botResponse += decoder.decode(value, { stream: true });
          read();
        });
      };

      read();
    }).catch(err => {
      console.error('Erreur de streaming', err);
      this.botResponse = '❌ Erreur pendant la génération.';
      this.loading = false;
    });
  }
}
