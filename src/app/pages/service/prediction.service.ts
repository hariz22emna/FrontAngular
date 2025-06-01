import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Prediction } from '../../models/prediction';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://bawhofygablesfhgofsb.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd2hvZnlnYWJsZXNmaGdvZnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2OTkwOTksImV4cCI6MjA2NDI3NTA5OX0.9BBS26WLrd_H0KdrP2Wu8LSywPJyDU-17h0E1SsFLo0'
    );
  }

  async getPredictions(): Promise<Prediction[]> {
    const { data, error } = await this.supabase
      .from('predictions')
      .select('*') // ✅ Sélectionner tous les champs pour éviter les oublis
      .order('id', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error.message);
      return [];
    }

    return (data as Prediction[] || []).filter(p =>
      p.real_wait_time !== null &&
      p.predicted_wait_time !== null &&
      !isNaN(p.real_wait_time) &&
      !isNaN(p.predicted_wait_time)
    );
  }

  async deletePrediction(id: number) {
    return await this.supabase.from('predictions').delete().eq('id', id);
  }

  async updatePrediction(id: number, fields: Partial<Prediction>) {
    return await this.supabase.from('predictions').update(fields).eq('id', id);
  }

  async getPredictionCount(): Promise<number> {
    const predictions = await this.getPredictions();
    return predictions.length;
  }

  async addPrediction(prediction: Partial<Prediction>) {
    console.log('🔥 Données à insérer:', prediction); // ✅ Debug

    const { data, error } = await this.supabase
      .from('predictions')
      .insert([prediction])
      .select(); // ✅ Retourner les données insérées

    if (error) {
      console.error('❌ Erreur lors de l\'ajout de la prédiction :', error);
      throw error;
    }

    console.log('✅ Prédiction ajoutée avec succès:', data);
    return data;
  }
}
