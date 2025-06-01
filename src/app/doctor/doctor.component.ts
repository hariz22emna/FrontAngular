import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Doctor } from '../models/doctor';
import { Table } from 'primeng/table';
import { DoctorSupabaseService } from '../supabase/services/doctor-supabase.service';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    TagModule,
    InputIconModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ]
})
export class DoctorListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  doctors: Doctor[] = [];
  doctorDialog = false;
  editDialog = false;
  newDoctor: Partial<Doctor> = {};
  selectedDoctor: Doctor = {} as Doctor;
  submitted = false;
  loading = false;

  constructor(
    private doctorService: DoctorSupabaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  async loadDoctors() {
    this.loading = true;
    try {
      this.doctors = await this.doctorService.getDoctors();
    } catch (error) {
      console.error('Erreur de chargement des médecins:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de charger les docteurs.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  openNewDialog(): void {
    this.newDoctor = {};
    this.submitted = false;
    this.doctorDialog = true;
  }

  async saveDoctor(): Promise<void> {
    this.submitted = true;
    if (this.newDoctor.name && this.newDoctor.age && this.newDoctor.specialty && this.newDoctor.department) {
      this.loading = true;
      try {
        await this.doctorService.addDoctor({
          ...this.newDoctor,
          is_on_duty: this.newDoctor.is_on_duty ?? true
        } as Doctor);
        this.doctorDialog = false;
        await this.loadDoctors();

        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Le docteur a été ajouté avec succès',
          life: 3000
        });
      } catch (error) {
        console.error('Erreur lors de l’ajout du médecin :', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Impossible d’ajouter le docteur.',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    }
  }

  editDoctor(doctor: Doctor): void {
    this.selectedDoctor = { ...doctor };
    this.editDialog = true;
  }

  async updateDoctor(): Promise<void> {
    this.loading = true;
    try {
      await this.doctorService.updateDoctor(this.selectedDoctor);
      this.editDialog = false;
      await this.loadDoctors();

      this.messageService.add({
        severity: 'success',
        summary: 'Mis à jour',
        detail: 'Le docteur a été mis à jour avec succès',
        life: 3000
      });
    } catch (error) {
      console.error('Erreur de mise à jour :', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Echec de la mise à jour du docteur.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  confirmDeleteDoctor(doctor: Doctor): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer le docteur "${doctor.name}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.deleteDoctor(doctor.id);
      }
    });
  }

  async deleteDoctor(id: number): Promise<void> {
    this.loading = true;
    try {
      if (!id) throw new Error('ID du docteur manquant');
      await this.doctorService.deleteDoctor(id);
      await this.loadDoctors();

      this.messageService.add({
        severity: 'success',
        summary: 'Supprimé',
        detail: 'Le docteur a été supprimé avec succès',
        life: 3000
      });
    } catch (error) {
      console.error('Erreur de suppression :', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de supprimer le docteur.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  onGlobalFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }
}
