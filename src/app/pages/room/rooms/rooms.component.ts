import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Room } from '../../../models/room';
import { RoomSupabaseService } from '../../../supabase/services/room-supabase.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  rooms: Room[] = [];
  newRoom: Partial<Room> = {};
  selectedRoom: Room = {} as Room;
  roomDialog = false;
  editDialog = false;
  submitted = false;
  loading = false;

  constructor(
    private roomService: RoomSupabaseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  async loadRooms() {
    this.loading = true;
    try {
      const result = await this.roomService.getRooms();
      this.rooms = result ?? [];
    } catch (error) {
      console.error('Erreur lors du chargement des chambres :', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Échec du chargement des chambres.',
        life: 3000
      });
    } finally {
      this.loading = false;
    }
  }

  openNewDialog() {
    this.newRoom = {};
    this.submitted = false;
    this.roomDialog = true;
  }

  async saveRoom() {
    this.submitted = true;
    if (this.newRoom.room_number && this.newRoom.capacity !== undefined) {
      const room: Omit<Room, 'id'> = {
        room_number: this.newRoom.room_number,
        capacity: this.newRoom.capacity,
        occupied_beds: this.newRoom.occupied_beds ?? 0
      };
      try {
        this.loading = true;
        await this.roomService.addRoom(room);
        this.roomDialog = false;
        await this.loadRooms();
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: 'Chambre ajoutée avec succès',
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

  editRoom(room: Room) {
    this.selectedRoom = { ...room };
    this.editDialog = true;
  }

  async updateRoom() {
    try {
      this.loading = true;
      await this.roomService.updateRoom(this.selectedRoom);
      this.editDialog = false;
      await this.loadRooms();
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Chambre modifiée avec succès',
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

  confirmDeleteRoom(id: number): void {
    this.confirmationService.confirm({
      message: 'Voulez-vous vraiment supprimer cette chambre ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: () => {
        this.deleteRoom(id);
      }
    });
  }

  async deleteRoom(id: number) {
    try {
      this.loading = true;
      await this.roomService.deleteRoom(id);
      await this.loadRooms();
      this.messageService.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Chambre supprimée avec succès',
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

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }
}
