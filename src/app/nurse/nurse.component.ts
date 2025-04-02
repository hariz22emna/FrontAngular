import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Nurse } from '../models/nurse';
import { NurseService } from '../pages/service/nurse.service';

 

@Component({
  selector: 'app-nurses',
  standalone: true,
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.scss'],
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
export class NursesComponent implements OnInit {
  nurses: Nurse[] = [];
  nurseDialog: boolean = false;
  editDialogVisible: boolean = false;
  newNurse: Nurse = { id: 0, name: '', age: 0, department: '' };
  selectedNurse: Nurse = { id: 0, name: '', age: 0, department: '' };

  constructor(private nurseService: NurseService) {}

  ngOnInit(): void {
    this.loadNurses();
  }

  loadNurses(): void {
    this.nurses = this.nurseService.getNurses();
  }

  openNewNurseDialog(): void {
    this.newNurse = { id: 0, name: '', age: 0, department: '' };
    this.nurseDialog = true;
  }

  saveNurse(): void {
    if (this.newNurse.name && this.newNurse.age && this.newNurse.department) {
      this.newNurse.id = this.nurseService.generateNewId();
      this.nurseService.addNurse(this.newNurse);
      this.loadNurses();
      this.nurseDialog = false;
    }
  }

  editNurse(nurse: Nurse): void {
    this.selectedNurse = { ...nurse };
    this.editDialogVisible = true;
  }

  updateNurse(): void {
    this.nurseService.updateNurse(this.selectedNurse);
    this.loadNurses();
    this.editDialogVisible = false;
  }

  deleteNurse(id: number): void {
    this.nurseService.deleteNurse(id);
    this.loadNurses();
  }

  onGlobalFilter(table: any, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
