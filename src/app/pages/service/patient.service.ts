import { Injectable } from '@angular/core';
import { Patient } from '../../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patients: Patient[] = [
    {
      id: 1,
      nom: "Alice Dupont",
      maladie: "Grippe",
      emergency_level: '2',
      date_naissance: new Date(1990, 5, 15),
      date_entree: new Date(),
      etat: 'waiting'
    },
    {
      id: 2,
      nom: "Marc Leroy",
      maladie: "Fracture du bras",
      emergency_level: '3',
      date_naissance: new Date(1985, 10, 22),
      date_entree: new Date(),
      etat: 'waiting'
    },
    {
      id: 3,
      nom: "Sophie Martin",
      maladie: "Crise d'asthme",
      emergency_level: '5',
      date_naissance: new Date(2000, 2, 8),
      date_entree: new Date(),
      etat: 'waiting'
    },
    {
      id: 4,
      nom: "Jean Durand",
      maladie: "Infection urinaire",
      emergency_level: '1',
      date_naissance: new Date(1978, 7, 30),
      date_entree: new Date(),
      etat: 'waiting'
    },
    {
      id: 5,
      nom: "Laura Petit",
      maladie: "Appendicite",
      emergency_level: '4',
      date_naissance: new Date(1995, 11, 5),
      date_entree: new Date(),
      etat: 'waiting'
    }
  ];

  getPatients(): Patient[] {
    return [...this.patients]; // éviter les mutations directes
  }

  deletePatient(id: number): void {
    this.patients = this.patients.filter(patient => patient.id !== id);
  }

  addPatient(patient: Patient): void {
    const newPatient: Patient = {
      ...patient,
      id: this.generateId(),
      date_entree: patient.date_entree || new Date(),
      etat: 'waiting' // état par défaut
    };
    this.patients.push(newPatient);
  }

  updatePatient(updatedPatient: Patient): void {
    const index = this.patients.findIndex(p => p.id === updatedPatient.id);
    if (index > -1) {
      this.patients[index] = { ...updatedPatient };
    }
  }

  private generateId(): number {
    return this.patients.length > 0
      ? Math.max(...this.patients.map(p => p.id)) + 1
      : 1;
  }
}
