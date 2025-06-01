import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { Nurse } from '../models/nurse';
import { NurseSupabaseService } from '../supabase/services/nurse-supabase.service';
import { TagModule } from 'primeng/tag';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-nurses',
  standalone: true,
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss'],
  providers: [MessageService, ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    TagModule,
    InputSwitchModule,
    ToastModule,
    ConfirmDialogModule
  ]
})
export class NursesComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  nurses: Nurse[] = [];
  nurseDialog = false;
  editDialogVisible = false;
  newNurse: Partial<Nurse> = {};
  selectedNurse: Nurse = {} as Nurse;
  submitted = false;
  loading = false;

  constructor(
    private nurseService: NurseSupabaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadNurses();
  }

  async loadNurses(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.nurseService.getNurses();
      if (result && 'data' in result) {
        this.nurses = result.data as Nurse[];
      } else {
        throw new Error('Données invalides');
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Chargement des infirmiers échoué.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  openNewNurseDialog(): void {
    this.newNurse = {};
    this.submitted = false;
    this.nurseDialog = true;
  }

  async saveNurse(): Promise<void> {
    this.submitted = true;
    if (this.newNurse.name && this.newNurse.age !== undefined && this.newNurse.department) {
      const nurse: Partial<Nurse> = {
        ...this.newNurse,
        is_on_duty: this.newNurse.is_on_duty ?? true
      };
      this.loading = true;
      try {
        await this.nurseService.addNurse(nurse);
        this.nurseDialog = false;
        await this.loadNurses();
        this.messageService.add({
          severity: 'success',
          summary: 'Ajouté',
          detail: 'Infirmier ajouté avec succès',
          life: 3000
        });
      } catch (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Ajout échoué.',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    }
  }

  editNurse(nurse: Nurse): void {
    this.selectedNurse = { ...nurse };
    this.editDialogVisible = true;
  }

  async updateNurse(): Promise<void> {
    this.loading = true;
    try {
      await this.nurseService.updateNurse(this.selectedNurse);
      this.editDialogVisible = false;
      await this.loadNurses();
      this.messageService.add({
        severity: 'success',
        summary: 'Modifié',
        detail: 'Infirmier modifié avec succès',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Modification échouée.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  confirmDeleteNurse(nurse: Nurse): void {
    this.confirmationService.confirm({
      message: `Voulez-vous vraiment supprimer l'infirmier "${nurse.name}" ?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.deleteNurse(nurse.id);
      }
    });
  }

  async deleteNurse(id: number): Promise<void> {
    this.loading = true;
    try {
      await this.nurseService.deleteNurse(id);
      await this.loadNurses();
      this.messageService.add({
        severity: 'success',
        summary: 'Supprimé',
        detail: 'Infirmier supprimé avec succès',
        life: 3000
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Suppression échouée.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  onGlobalFilter(table: Table, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }
}
