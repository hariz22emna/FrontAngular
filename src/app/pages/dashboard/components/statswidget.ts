import { Component, OnInit } from '@angular/core';
import { PredictionService } from '../../service/prediction.service';
import { DoctorSupabaseService } from '../../../supabase/services/doctor-supabase.service';
import { NurseSupabaseService } from '../../../supabase/services/nurse-supabase.service';
import { RoomSupabaseService } from '../../../supabase/services/room-supabase.service';


@Component({
  selector: 'app-stats-widget',
  standalone: true,
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Total Patients -->
      <div class="card p-4 flex items-center justify-between">
        <div>
          <span class="block text-sm text-muted font-semibold uppercase mb-1">Total Patients</span>
          <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ totalPatients }}</div>
        </div>
        <div class="bg-cyan-100 text-cyan-600 rounded-full p-2">
          <i class="pi pi-users text-xl"></i>
        </div>
      </div>

      <!-- Total Doctors -->
      <div class="card p-4 flex items-center justify-between">
        <div>
          <span class="block text-sm text-muted font-semibold uppercase mb-1">Total Doctors</span>
          <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ totalDoctors }}</div>
        </div>
        <div class="bg-green-100 text-green-600 rounded-full p-2">
          <i class="pi pi-user-plus text-xl"></i>
        </div>
      </div>

      <!-- Total Nurses -->
      <div class="card p-4 flex items-center justify-between">
        <div>
          <span class="block text-sm text-muted font-semibold uppercase mb-1">Total Nurses</span>
          <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ totalNurses }}</div>
        </div>
        <div class="bg-pink-100 text-pink-600 rounded-full p-2">
          <i class="pi pi-heart text-xl"></i>
        </div>
      </div>

      <!-- Available Beds -->
      <div class="card p-4 flex items-center justify-between">
        <div>
          <span class="block text-sm text-muted font-semibold uppercase mb-1">Available Beds</span>
          <div class="text-3xl font-bold text-slate-900 dark:text-white">{{ totalAvailableBeds }}</div>
        </div>
        <div class="bg-purple-100 text-purple-600 rounded-full p-2">
          <i class="pi pi-bed text-xl"></i>
        </div>
      </div>
    </div>
  `
})
export class StatsWidget implements OnInit {
  totalPatients = 0;
  totalDoctors = 0;
  totalNurses = 0;
  totalAvailableBeds = 0;

  constructor(
    private predictionService: PredictionService,
    private doctorService: DoctorSupabaseService,
    private nurseService: NurseSupabaseService,
    private roomService: RoomSupabaseService
  ) {}

  async ngOnInit() {
    this.totalPatients = await this.predictionService.getPredictionCount();
    this.totalDoctors = (await this.doctorService.getDoctors()).length;

    const nurses = await this.nurseService.getNurses();
    this.totalNurses = nurses.data?.length || 0;

    const rooms = await this.roomService.getRooms();
    this.totalAvailableBeds = rooms?.reduce(
      (acc, room) => acc + ((room.capacity ?? 0) - (room.occupied_beds ?? 0)),
      0
    ) || 0;
  }
}