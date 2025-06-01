import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

import { PredictionService } from '../service/prediction.service';
import { Prediction } from '../../models/prediction';

@Component({
  selector: 'app-prediction',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionComponent implements OnInit {
  predictions: Prediction[] = [];
  loading = true;

  editDialogVisible = false;
  predictionDialogVisible = false;

  selectedPrediction: Prediction = {} as Prediction;
  newPrediction: Partial<Prediction> = {};

  selectedDay: string = '';
  selectedSeason: string = '';
  selectedRegion: string = '';

  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  regions = ['Urban', 'Rural'];

  fields = [
    { model: 'real_wait_time', label: 'Temps d\'attente réel (min)', required: true },
    { model: 'predicted_wait_time', label: 'Temps d\'attente prédit (min)', required: true },
    { model: 'time_to_registration', label: 'Temps jusqu\'à l\'enregistrement (min)', required: false },
    { model: 'time_to_triage', label: 'Temps jusqu\'au triage (min)', required: false },
    { model: 'available_beds_percent', label: 'Pourcentage de lits disponibles', required: false },
    { model: 'time_of_day', label: 'Heure de la journée', required: false },
    { model: 'urgency_level', label: 'Niveau d\'urgence', required: true },
    { model: 'nurse_to_patient_ratio', label: 'Ratio infirmière/patient', required: false },
    { model: 'specialist_availability', label: 'Disponibilité des spécialistes', required: false },
    { model: 'queue_size', label: 'Taille de la file d\'attente', required: false }
  ];

  constructor(
    private predictionService: PredictionService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadPredictions();
  }

  async loadPredictions() {
    this.loading = true;
    try {
      this.predictions = await this.predictionService.getPredictions();
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec du chargement des prédictions.' });
    }
    this.loading = false;
  }

  openNewPredictionDialog() {
    this.newPrediction = {
      real_wait_time: undefined,
      predicted_wait_time: undefined,
      time_to_registration: undefined,
      time_to_triage: undefined,
      available_beds_percent: undefined,
      time_of_day: undefined,
      urgency_level: undefined,
      nurse_to_patient_ratio: undefined,
      specialist_availability: undefined,
      queue_size: undefined
    };
    this.selectedDay = '';
    this.selectedSeason = '';
    this.selectedRegion = '';
    this.predictionDialogVisible = true;
  }

  async savePrediction() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Champs manquants', detail: 'Veuillez remplir tous les champs requis.' });
      return;
    }

    const dayBooleans: any = {};
    this.days.forEach(day => {
      const key = `day_of_week_${day.toLowerCase()}`;
      dayBooleans[key] = this.selectedDay === day;
    });

    const seasonBooleans: any = {};
    this.seasons.forEach(season => {
      const key = `season_${season.toLowerCase()}`;
      seasonBooleans[key] = this.selectedSeason === season;
    });

    const fullPrediction: Partial<Prediction> = {
      ...this.convertAllFieldsToNumbers(this.newPrediction),
      region_urban: this.selectedRegion === 'Urban',
      region_rural: this.selectedRegion === 'Rural',
      is_weekend: ['Saturday', 'Sunday'].includes(this.selectedDay),
      ...dayBooleans,
      ...seasonBooleans
    };

    try {
      await this.predictionService.addPrediction(fullPrediction);
      this.predictionDialogVisible = false;
      await this.loadPredictions();
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prédiction ajoutée avec succès.' });
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Ajout échoué.' });
    }
  }

private convertAllFieldsToNumbers(data: Partial<Prediction>): Partial<Prediction> {
  const result: Partial<Prediction> = {};

  (Object.keys(data) as (keyof Prediction)[]).forEach((key) => {
    const rawValue = data[key];
    const converted = this.convertToNumber(rawValue);

    // On n'assigne la valeur que si elle n'est pas undefined
    if (converted !== undefined) {
      (result as Record<string, number>)[key] = converted;
    }
  });

  return result;
}


  private isFormValid(): boolean {
    const requiredFields = this.fields.filter(field => field.required);
    const fieldsValid = requiredFields.every(field => {
      const value = this.newPrediction[field.model as keyof Prediction];
      return this.isValidValue(value);
    });
    return fieldsValid && !!this.selectedDay && !!this.selectedSeason && !!this.selectedRegion;
  }

  private isValidValue(value: any): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string' && value.trim() === '') return false;
    if (typeof value === 'number' && isNaN(value)) return false;
    return true;
  }

  private convertToNumber(value: any): number | undefined {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'number') return isNaN(value) ? undefined : value;
    if (typeof value === 'string' && value.trim() === '') return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  }

  editPrediction(prediction: Prediction) {
    this.selectedPrediction = { ...prediction };
    this.editDialogVisible = true;
  }

  async saveEditedPrediction() {
    try {
      const { id, ...fields } = this.selectedPrediction;
      const { error } = await this.predictionService.updatePrediction(id, {
        predicted_wait_time: this.convertToNumber(fields.predicted_wait_time),
        real_wait_time: this.convertToNumber(fields.real_wait_time),
        urgency_level: this.convertToNumber(fields.urgency_level)
      });

      if (!error) {
        const index = this.predictions.findIndex(p => p.id === id);
        if (index !== -1) this.predictions[index] = { ...this.selectedPrediction };
        this.editDialogVisible = false;
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prédiction mise à jour.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la mise à jour.' });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Exception lors de la mise à jour.' });
    }
  }

  confirmDeletePrediction(id: number) {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer cette prédiction ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => this.deletePrediction(id)
    });
  }

  async deletePrediction(id: number) {
    try {
      const { error } = await this.predictionService.deletePrediction(id);
      if (!error) {
        this.predictions = this.predictions.filter(p => p.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Prédiction supprimée.' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Suppression échouée.' });
      }
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Exception lors de la suppression.' });
    }
  }

  getFieldValue(field: string) {
    return this.newPrediction[field as keyof Prediction];
  }

  setFieldValue(field: string, value: any) {
    if (field in this.newPrediction) {
      (this.newPrediction as Record<string, any>)[field] = value;
    }
  }

  getEditFieldValue(field: string) {
    return this.selectedPrediction[field as keyof Prediction];
  }

  setEditFieldValue(field: string, value: any) {
    if (field in this.selectedPrediction) {
      (this.selectedPrediction as Record<string, any>)[field] = value;
    }
  }
}
