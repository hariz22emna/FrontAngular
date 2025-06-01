import { Injectable } from '@angular/core';
import { Doctor } from '../../models/doctor';
import { supabase } from '../../supabaseClient';

@Injectable({
  providedIn: 'root'
})
export class DoctorSupabaseService {
  private table = 'doctors';

  async getDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase.from(this.table).select('*');
    if (error) {
      console.error('Erreur de chargement des docteurs :', error.message);
      return [];
    }
    return data as Doctor[];
  }

  async addDoctor(doctor: Partial<Doctor>): Promise<void> {
    const { error } = await supabase.from(this.table).insert(doctor);
    if (error) {
      console.error('Erreur lors de l’ajout du docteur :', error.message);
      throw new Error(error.message);
    }
  }

  async updateDoctor(doctor: Doctor): Promise<void> {
    const { error } = await supabase
      .from(this.table)
      .update(doctor)
      .eq('id', doctor.id);
    if (error) {
      console.error('Erreur lors de la mise à jour :', error.message);
      throw new Error(error.message);
    }
  }

  async deleteDoctor(id: number): Promise<void> {
    console.log('Suppression du docteur avec ID :', id);
    const { error } = await supabase
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erreur lors de la suppression :', error.message);
      throw new Error(error.message);
    } else {
      console.log('Suppression réussie');
    }
  }
}
