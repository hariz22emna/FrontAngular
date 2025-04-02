import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientService } from '../service/patient.service';
import { Patient } from '../../models/patient';
import { ElementRef, ViewChild } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';

interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    TableModule,
    MultiSelectModule,
    SelectModule,
    InputIconModule,
    TagModule,
    InputTextModule,
    SliderModule,
    ProgressBarModule,
    ToggleButtonModule,
    ToastModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    RatingModule,
    RippleModule,
    IconFieldModule,
    DropdownModule,
    DialogModule,
    CalendarModule
  ],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  loading: boolean = true;
  etatOptions = [
    { label: 'En attente', value: 'waiting' },
    { label: 'Pris en charge', value: 'in-progress' },
    { label: 'Sorti', value: 'left' }
  ];
  selectedEtat: string = '';

  // Ajout patient
  patientDialog: boolean = false;
  submitted: boolean = false;
  newPatient: Partial<Patient> = {};

  emergencyLevels = [
    { label: '1 - Faible', value: '1' },
    { label: '2 - Légère', value: '2' },
    { label: '3 - Moyenne', value: '3' },
    { label: '4 - Élevée', value: '4' },
    { label: '5 - Critique', value: '5' }
  ];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();

    setInterval(() => {
      this.patients = [...this.patients];
    }, 60000);
  }

  loadPatients(): void {
    this.patients = this.patientService.getPatients();
    this.loading = false;
  }

  openNewPatientDialog() {
    this.newPatient = {};
    this.submitted = false;
    this.patientDialog = true;
  }

  savePatient() {
    this.submitted = true;
    if (this.newPatient.nom && this.newPatient.date_naissance && this.newPatient.maladie && this.newPatient.emergency_level) {
      this.patientService.addPatient({
        ...this.newPatient,
        date_entree: new Date(),
        etat: 'waiting'
      } as Patient);
      this.patientDialog = false;
      this.loadPatients();
    }
  }

  deletePatient(id: number): void {
    this.patientService.deletePatient(id);
    this.loadPatients();
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onEtatChange(event: any, table: Table) {
    table.filter(event.value, 'etat', 'equals');
  }

  getSeverity(level: string) {
    switch (level) {
      case '1':
        return 'secondary';   // 🔳 Niveau 1 – Gris foncé
      case '2':
        return 'info';       // 🟦 Niveau 2 – Bleu
      case '3':
        return 'success';    // 🟩 Niveau 3 – Vert
      case '4':
        return 'warn';       // 🟨 Niveau 4 – Orange
      case '5':
        return 'danger';     // 🟥 Niveau 5 – Rouge
      default:
        return 'contrast';  // ⚪ Si aucune correspondance
    }
  }
  

  calculateAge(dateNaissance: Date): number {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  calculateWaitingTime(dateEntree: Date, dateFin?: Date): string {
    const end = dateFin ? new Date(dateFin) : new Date();
    const entree = new Date(dateEntree);
    const diffMs = end.getTime() - entree.getTime();

    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j ${hours % 24}h`;
    else if (hours > 0) return `${hours}h ${minutes % 60}m`;
    else return `${minutes} min`;
  }

  changerEtat(patient: Patient, nouvelEtat: 'waiting' | 'in-progress' | 'left') {
    patient.etat = nouvelEtat;

    if (nouvelEtat === 'left') {
      patient.date_sortie = new Date();
    }

    this.patientService.updatePatient(patient);
  }

  getEtatLabel(etat: string): string {
    switch (etat) {
      case 'waiting':
        return 'En attente';
      case 'in-progress':
        return 'Pris en charge';
      case 'left':
        return 'Sorti';
      default:
        return '';
    }
  }

  getEtatSeverity(etat: 'waiting' | 'in-progress' | 'left'): 'success' | 'info' | 'warn' | 'danger' | 'contrast' | 'secondary' {
    switch (etat) {
      case 'waiting':
        return 'warn';
      case 'in-progress':
        return 'success';
      case 'left':
        return 'danger';
      default:
        return 'secondary';
    }
  }
  selectedPatient: Patient = {} as Patient;
editDialogVisible: boolean = false;

editPatient(patient: Patient) {
  this.selectedPatient = { ...patient };
  this.editDialogVisible = true;
}

updatePatient() {
  if (!this.selectedPatient.nom) return;

  this.patientService.updatePatient(this.selectedPatient);
  this.loadPatients();
  this.editDialogVisible = false;
}
selectedUrgenceLevel: string = '';

onUrgenceChange(event: any, table: Table) {
  table.filter(event.value, 'emergency_level', 'equals');
}


}
