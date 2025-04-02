export interface Patient {
  id: number;
  nom: string;
  date_naissance: Date;
  maladie: string;
  emergency_level: string;
  date_entree: Date;
  date_sortie?: Date; // Date de sortie si le patient a quitté l’hôpital
  etat: 'waiting' | 'in-progress' | 'left'; // 🆕 Représente l'état du patient
}
