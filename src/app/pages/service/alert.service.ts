import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertSubject = new Subject<string>();
  private socket: WebSocket | null = null;
  private reconnectDelay = 3000; // délai de reconnexion en ms (3 secondes)

  constructor() {
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const wsUrl = 'ws://localhost:8000/ws/alerts';
    console.log(`🔌 Connexion WebSocket à : ${wsUrl}`);
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('✅ WebSocket connecté avec succès.');
    };

    this.socket.onmessage = (event) => {
      console.log('📨 Message reçu depuis WebSocket :', event.data);
      this.alertSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('❌ Erreur WebSocket :', error);
    };

    this.socket.onclose = (event) => {
      console.warn('⚠️ WebSocket fermé. Code:', event.code, 'Raison:', event.reason);
      // Tente de se reconnecter après un délai
      setTimeout(() => this.connectWebSocket(), this.reconnectDelay);
    };
  }

  getAlerts(): Observable<string> {
    return this.alertSubject.asObservable();
  }
}
