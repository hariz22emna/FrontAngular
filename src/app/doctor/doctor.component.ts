import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Doctor } from '../models/doctor';
import { DoctorService } from '../pages/service/doctor.service';


@Component({
  selector: 'app-doctor',
  standalone: true,
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    IconFieldModule,
    InputIconModule
  ]
})
export class DoctorListComponent implements OnInit {
  doctors: Doctor[] = [];
  doctorDialog: boolean = false;
  editDialogVisible: boolean = false;
  newDoctor: Doctor = { id: 0, name: '', age: 0, specialty: '', department: '' };
  selectedDoctor: Doctor = { id: 0, name: '', age: 0, specialty: '', department: '' };

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctors = this.doctorService.getDoctors();
  }

  openNewDoctorDialog(): void {
    this.newDoctor = { id: 0, name: '', age: 0, specialty: '', department: '' };
    this.doctorDialog = true;
  }

  saveDoctor(): void {
    if (this.newDoctor.name && this.newDoctor.age && this.newDoctor.specialty && this.newDoctor.department) {
      this.doctorService.addDoctor({
        ...this.newDoctor,
        id: this.generateNewId()
      });
      this.loadDoctors();
      this.doctorDialog = false;
    }
  }

  editDoctor(doctor: Doctor): void {
    this.selectedDoctor = { ...doctor };
    this.editDialogVisible = true;
  }

  updateDoctor(): void {
    this.doctorService.updateDoctor(this.selectedDoctor);
    this.loadDoctors();
    this.editDialogVisible = false;
  }

  deleteDoctor(id: number): void {
    this.doctorService.deleteDoctor(id);
    this.loadDoctors();
  }

  generateNewId(): number {
    return this.doctors.length ? Math.max(...this.doctors.map(d => d.id)) + 1 : 1;
  }

  onGlobalFilter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
