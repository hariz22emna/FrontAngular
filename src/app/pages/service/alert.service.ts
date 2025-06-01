import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private socket: WebSocket;
  private alertSubject = new Subject<string>();
  
private surchargeSubject = new Subject<{ time: string, value: number }>();

getSurchargeData(): Observable<{ time: string, value: number }> {
  return this.surchargeSubject.asObservable();
}


  constructor() {
    this.socket = new WebSocket('ws://localhost:8001/ws/alerts');
    
    this.socket.onopen = () => {
      console.log('✅ WebSocket connecté');
    };

  this.socket.onmessage = (event) => {
  console.log('📨 Message reçu :', event.data);
  this.alertSubject.next(event.data);

  if (event.data.startsWith('SURCHARGE_EVENT:')) {
    const value = parseInt(event.data.split(':')[1], 10);
    this.surchargeSubject.next({ time: new Date().toLocaleTimeString(), value });
  }
};



    this.socket.onerror = (err) => {
      console.error('❌ Erreur WebSocket', err);
    };

    this.socket.onclose = () => {
      console.warn('❌ WebSocket fermé');
    };
  }

  getAlerts(): Observable<string> {
    return this.alertSubject.asObservable();
  }

  notify(message: string) {
    this.alertSubject.next(message); // aussi utilisable côté frontend
  }
}
