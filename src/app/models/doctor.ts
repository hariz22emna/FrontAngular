// src/app/models/doctor.ts

export interface Doctor {
    id: number;
    name: string;
    age: number | null;  // (ou simplement number si tu préfères)
    specialty: string;
    department: string;
  }
  