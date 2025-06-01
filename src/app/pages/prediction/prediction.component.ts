import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PredictionService } from '../service/prediction.service';
import { Prediction } from '../../models/prediction';
import { DropdownModule } from 'primeng/dropdown';

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
    InputTextModule
  ],
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

  // ✅ Définition des champs pour la modal d'ajout
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

  constructor(private predictionService: PredictionService) {}

  async ngOnInit() {
    await this.loadPredictions();
  }

  async loadPredictions() {
    this.loading = true;
    try {
      this.predictions = await this.predictionService.getPredictions();
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      alert('Erreur lors du chargement des prédictions');
    }
    this.loading = false;
  }

  openNewPredictionDialog() {
    // ✅ Réinitialiser complètement le formulaire
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
    try {
      if (!this.isFormValid()) {
        alert('Veuillez remplir tous les champs requis');
        return;
      }

      // ✅ Jour : snake_case pour Supabase
      const dayBooleans: any = {};
      this.days.forEach(day => {
        const key = `day_of_week_${day.toLowerCase()}`;
        dayBooleans[key] = this.selectedDay === day;
      });

      // ✅ Saison : snake_case
      const seasonBooleans: any = {};
      this.seasons.forEach(season => {
        const key = `season_${season.toLowerCase()}`;
        seasonBooleans[key] = this.selectedSeason === season;
      });

      const fullPrediction: Partial<Prediction> = {
        real_wait_time: this.convertToNumber(this.newPrediction.real_wait_time),
        predicted_wait_time: this.convertToNumber(this.newPrediction.predicted_wait_time),
        time_to_registration: this.convertToNumber(this.newPrediction.time_to_registration),
        time_to_triage: this.convertToNumber(this.newPrediction.time_to_triage),
        available_beds_percent: this.convertToNumber(this.newPrediction.available_beds_percent),
        time_of_day: this.convertToNumber(this.newPrediction.time_of_day),
        urgency_level: this.convertToNumber(this.newPrediction.urgency_level),
        nurse_to_patient_ratio: this.convertToNumber(this.newPrediction.nurse_to_patient_ratio),
        specialist_availability: this.convertToNumber(this.newPrediction.specialist_availability),
        queue_size: this.convertToNumber(this.newPrediction.queue_size),
        region_urban: this.selectedRegion === 'Urban',
        region_rural: this.selectedRegion === 'Rural',
        is_weekend: ['Saturday', 'Sunday'].includes(this.selectedDay),
        ...dayBooleans,
        ...seasonBooleans
      };

      console.log('✅ Envoi à Supabase :', fullPrediction);

      await this.predictionService.addPrediction(fullPrediction);
      this.predictionDialogVisible = false;
      await this.loadPredictions();
      alert('✅ Prédiction ajoutée avec succès !');
    } catch (error) {
      console.error('❌ Erreur lors de l\'ajout :', error);
      alert('Erreur lors de l\'ajout de la prédiction');
    }
  }

  // ✅ Fonction de validation améliorée
  private isFormValid(): boolean {
    const requiredFields = this.fields.filter(field => field.required);
    const fieldsValid = requiredFields.every(field => {
      const value = this.newPrediction[field.model as keyof Prediction];
      return this.isValidValue(value);
    });

    return fieldsValid && !!this.selectedDay && !!this.selectedSeason && !!this.selectedRegion;
  }

  // ✅ Fonction utilitaire pour valider les valeurs
  private isValidValue(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }
    
    // Pour les chaînes vides
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    
    // Pour les nombres (accepter 0 comme valide)
    if (typeof value === 'number' && isNaN(value)) {
      return false;
    }
    
    return true;
  }

  // ✅ Utilitaire pour convertir en nombre (amélioré)
  private convertToNumber(value: any): number | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }
    
    // Si c'est déjà un nombre
    if (typeof value === 'number') {
      return isNaN(value) ? undefined : value;
    }
    
    // Si c'est une chaîne vide ou juste des espaces
    if (typeof value === 'string' && value.trim() === '') {
      return undefined;
    }
    
    // Tentative de conversion
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
        alert('Prédiction mise à jour avec succès !');
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  }

  // ✅ Méthodes pour la modal d'ajout
  getFieldValue(field: string) {
    return this.newPrediction[field as keyof Prediction];
  }

  setFieldValue(field: string, value: any) {
    // ✅ Assignation sécurisée avec vérification de type
    if (field in this.newPrediction) {
      (this.newPrediction as Record<string, any>)[field] = value;
    }
  }

  // ✅ Méthodes pour la modal d'édition
  getEditFieldValue(field: string) {
    return this.selectedPrediction[field as keyof Prediction];
  }

  setEditFieldValue(field: string, value: any) {
    // ✅ Assignation sécurisée avec vérification de type
    if (field in this.selectedPrediction) {
      (this.selectedPrediction as Record<string, any>)[field] = value;
    }
  }

  async deletePrediction(id: number) {
    if (confirm(`Supprimer la prédiction #${id} ?`)) {
      try {
        const { error } = await this.predictionService.deletePrediction(id);
        if (!error) {
          this.predictions = this.predictions.filter(p => p.id !== id);
          alert('Prédiction supprimée avec succès !');
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression');
      }
    }
  }
}