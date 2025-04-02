import { Injectable } from '@angular/core';
import { Nurse } from '../../models/nurse';

@Injectable({
  providedIn: 'root'
})
export class NurseService {
  private nurses: Nurse[] = [
    { id: 1, name: 'Sarah Lefevre', age: 30, department: 'Urgences' },
    { id: 2, name: 'Marc Dubois', age: 45, department: 'Pédiatrie' }
  ];

  getNurses(): Nurse[] {
    return this.nurses;
  }

  addNurse(nurse: Nurse): void {
    this.nurses.push(nurse);
  }

  updateNurse(nurse: Nurse): void {
    const index = this.nurses.findIndex(n => n.id === nurse.id);
    if (index !== -1) {
      this.nurses[index] = { ...nurse };
    }
  }

  deleteNurse(id: number): void {
    this.nurses = this.nurses.filter(n => n.id !== id);
  }

  generateNewId(): number {
    return this.nurses.length ? Math.max(...this.nurses.map(n => n.id)) + 1 : 1;
  }
}
