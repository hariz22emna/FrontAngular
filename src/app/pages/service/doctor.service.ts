import { Injectable } from '@angular/core';

export interface Doctor {
  id: number;
  name: string;
  age: number | null ;
  specialty: string;
  department: string;
}

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private doctors: Doctor[] = [
    { id: 1, name: 'Dr. John', age: 45, specialty: 'Cardiology', department: 'Heart' },
    { id: 2, name: 'Dr. Emily', age: 36, specialty: 'Neurology', department: 'Brain' },
  ];

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  addDoctor(doctor: Doctor): void {
    doctor.id = this.doctors.length > 0 
      ? Math.max(...this.doctors.map(d => d.id)) + 1 : 1;
    this.doctors.push(doctor);
  }

  updateDoctor(updatedDoctor: Doctor): void {
    const index = this.doctors.findIndex(d => d.id === updatedDoctor.id);
    if (index !== -1) this.doctors[index] = updatedDoctor;
  }

  deleteDoctor(id: number): void {
    this.doctors = this.doctors.filter(d => d.id !== id);
  }
}
