
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SurchargeService {
  constructor(private http: HttpClient) {}

  // Données statiques pour le développement
  private mockData = {
    results: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      surcharge_level: this.generateSurchargeLevel(i)
    }))
  };

  private generateSurchargeLevel(hour: number): number {
    // Simulation d'une courbe réaliste de surcharge hospitalière
    if (hour >= 0 && hour < 6) {
      return 0.2; // Nuit calme
    } else if (hour >= 6 && hour < 9) {
      return 0.4; // Début de matinée
    } else if (hour >= 9 && hour < 12) {
      return 0.7; // Pic du matin
    } else if (hour >= 12 && hour < 14) {
      return 0.5; // Pause déjeuner
    } else if (hour >= 14 && hour < 17) {
      return 0.6; // Après-midi
    } else if (hour >= 17 && hour < 20) {
      return 0.8; // Pic du soir
    } else {
      return 0.3; // Soirée
    }
  }

  // Récupère les surcharges toutes les X secondes
  getSurchargeStatus(intervalMs: number = 10000): Observable<any> {
    // Pour le développement, retourne directement les données mockées
    return of(this.mockData);
  }

  // Récupère la surcharge groupée par heure
  getHourlySurchargeChart(): Observable<any> {
    // Pour le développement, retourne directement les données mockées
    return of(this.mockData);
  }
}
