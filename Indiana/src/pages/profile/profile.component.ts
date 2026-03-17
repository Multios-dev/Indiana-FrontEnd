import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

export interface UserProfile {
  firstName: string;
  lastName: string;
  totem: string;
  birthDate?: string;
  gender?: string;
  nationalReg?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  zipCode?: string;
}

export interface Mandat {
  id: number;
  role: string;
  unit: string;
  from: string;
  to: string;
  isActive: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TranslateModule, TranslatePipe, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  activeTab: 'info' | 'mandats' | 'competences' = 'info';

  isEditing = false;

  user: UserProfile = {
    firstName: 'Paul',
    lastName: 'Martin',
    totem: 'Aigle',
    email: 'simple@test.scout.be',
  };

  editableUser: UserProfile = { ...this.user };

  get initials(): string {
    return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase();
  }

  startEdit() {
    this.editableUser = { ...this.user };
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  save() {
    this.user = { ...this.editableUser };
    this.isEditing = false;
  }

  mandats: Mandat[] = [
    { id: 1, role: 'preinscribed', unit: 'Unité 17 - Les hiboux',  from: '2026-02-24', to: 'Présent', isActive: true },
    { id: 2, role: 'preinscribed', unit: 'Unité 23 - Les Cerfs',   from: '2026-02-24', to: 'Présent', isActive: true },
    { id: 3, role: 'preinscribed', unit: 'Section Bruxelles',      from: '2026-02-18', to: 'Présent', isActive: true },
    { id: 4, role: 'Membre',       unit: 'Unité 42 - Les Castors', from: '2024-09-01', to: 'Présent', isActive: true },
  ];
}