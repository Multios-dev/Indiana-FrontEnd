import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MembershipService } from '../../services/membership.service';
import { ToastService } from '../../services/toast.service';
import { UserOutput } from '../../models/user-output';
import { Membership } from '../../models/membership';

export interface UserProfile {
  firstNames: string;  // Prénoms séparés par des virgules
  lastName: string;
  totem: string;
  birthDate?: string;
  gender?: string;
  nationalReg?: string;
  email?: string;
  phone?: string;
  website?: string;
  nationality?: string[];
  street?: string;
  boxNumber?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  residentialStreet?: string;
  residentialBoxNumber?: string;
  residentialCity?: string;
  residentialZipCode?: string;
  residentialCountry?: string;
}

export interface Mandat {
  id: string;
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
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private membershipService = inject(MembershipService);
  private toastService = inject(ToastService);
  private activatedRoute = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  
  // ID de l'utilisateur dont on affiche le profil (peut être différent de l'utilisateur connecté)
  private displayedUserId: string | null = null;
  // ID de l'utilisateur actuellement connecté
  private currentUserId: string | null = null;
  // Indique si on affiche le profil de l'utilisateur connecté
  public isOwnProfile = true;
  // Indique si l'utilisateur connecté peut modifier ce profil (propre profil ou mineur à charge)
  public canEditProfile = false;
  // Liste des mineurs sous la responsabilité de l'utilisateur connecté
  private minorsUnderMyResponsibility: UserOutput[] = [];
  
  public activeTab: 'info' | 'mandats' | 'competences' = 'info';

  public isEditing = false;

  public isLoading = signal(true);

  public isConfirmingUpdate = false;

  public isSavingUpdate = false;

  user: UserProfile = {
    firstNames: '',
    lastName: '',
    totem: '',
    email: '',
  };

  public editableUser: UserProfile = { ...this.user };

  mandats: Mandat[] = [];

  ngOnInit(): void {
    // Récupérer l'ID de l'utilisateur connecté
    this.currentUserId = this.authService.getUserId();
    
    // Récupérer le userId depuis les paramètres de la route
    this.activatedRoute.params.subscribe(params => {
      if (params['userId']) {
        this.displayedUserId = params['userId'];
        this.isOwnProfile = false;
      } else {
        this.displayedUserId = this.currentUserId;
        this.isOwnProfile = true;
      }
      
      // Vérifier immédiatement les permissions (pour le profil de l'utilisateur connecté, pas besoin d'attendre)
      this.checkEditPermission();
      
      // Charger les mineurs de l'utilisateur connecté pour vérifier les permissions (pour les autres profils)
      this.loadMinorsUnderMyResponsibility();
      this.loadUserProfile();
      this.loadMandats();
    });
  }

  /**
   * Charger la liste des mineurs sous la responsabilité de l'utilisateur connecté
   */
  private loadMinorsUnderMyResponsibility(): void {
    if (!this.currentUserId) {
      return;
    }

    this.userService.getMinorsUsersById(this.currentUserId).subscribe({
      next: (minors: UserOutput[]) => {
        this.minorsUnderMyResponsibility = minors || [];
        // Re-vérifier les permissions en cas de changement
        this.checkEditPermission();
        this.cdr.markForCheck();
      },
      error: (err) => {
        // Pas d'erreur bloquante, on continue
        this.minorsUnderMyResponsibility = [];
        this.checkEditPermission();
      }
    });
  }

  /**
   * Vérifier si l'utilisateur peut modifier le profil actuellement affiché
   */
  private checkEditPermission(): void {
    if (this.isOwnProfile) {
      // Cas 1: C'est son propre profil
      this.canEditProfile = true;
    } else if (this.minorsUnderMyResponsibility.some(minor => minor.id === this.displayedUserId)) {
      // Cas 2: C'est un mineur sous sa responsabilité
      this.canEditProfile = true;
    } else {
      // Cas 3: Pas autorisé à modifier
      this.canEditProfile = false;
    }
  }

  private loadUserProfile(): void {
    if (!this.displayedUserId) {
      this.isLoading.set(false);
      return;
    }
    
    // Utiliser la méthode du service pour récupérer n'importe quel utilisateur
    this.userService.getUserById(this.displayedUserId).subscribe({
      next: (userInfo: UserOutput) => {
        this.user = {
          firstNames: userInfo.first_names?.join(', ') || '',
          lastName: userInfo.last_name || '',
          totem: userInfo.totem || '',
          email: userInfo.contact?.email,
          phone: userInfo.contact?.phone,
          website: userInfo.contact?.website,
          birthDate: userInfo.birth_date,
          gender: userInfo.gender,
          nationality: userInfo.nationality,
          // Adresse principale
          street: userInfo.home_address?.thoroughfare,
          boxNumber: userInfo.home_address?.box_number,
          city: userInfo.home_address?.post_name,
          zipCode: userInfo.home_address?.post_code,
          country: userInfo.home_address?.country,
          // Adresse résidentielle
          residentialStreet: userInfo.residential_address?.thoroughfare,
          residentialBoxNumber: userInfo.residential_address?.box_number,
          residentialCity: userInfo.residential_address?.post_name,
          residentialZipCode: userInfo.residential_address?.post_code,
          residentialCountry: userInfo.residential_address?.country,
        };
        this.editableUser = { ...this.user };
        this.isLoading.set(false);
      },
      error: (err: any) => {
        // console.error('Erreur lors du chargement du profil:', err);
        this.isLoading.set(false);
      }
    });
  }

  private loadMandats(): void {
    if (!this.displayedUserId) {
      return;
    }
    
    this.membershipService.getMembershipsByUserId(this.displayedUserId).subscribe({
      next: (response: any) => {
        
        // Gérer les deux cas : tableau direct ou objet avec items
        let memberships: Membership[] = [];
        if (Array.isArray(response)) {
          memberships = response;
        } else if (response && response.items && Array.isArray(response.items)) {
          memberships = response.items;
        } else if (response && response.data && Array.isArray(response.data)) {
          memberships = response.data;
        }

        // Convertir les memberships en mandats
        this.mandats = memberships.map(membership => this.mapMembershipToMandat(membership));
      },
      error: (err: any) => {
        // console.error('❌ Erreur lors du chargement des mandats:', err);
        // console.error('   URL:', err.url);
        // console.error('   Status:', err.status);
        // console.error('   Message:', err.message);
        // Garder un array vide en cas d'erreur
        this.mandats = [];
      }
    });
  }

  private mapMembershipToMandat(membership: Membership): Mandat {
    const today = new Date();
    const startDate = new Date(membership.start_date);
    const endDate = membership.end_date ? new Date(membership.end_date) : null;

    // Vérifier si le mandat est actif
    const isActive = startDate <= today && (!endDate || endDate >= today);

    return {
      id: membership.id,
      role: membership.role,
      unit: membership.organization_id,
      from: membership.start_date,
      to: endDate ? membership.end_date! : 'Présent',
      isActive
    };
  }

  public get initials(): string {
    const names = this.user.firstNames?.split(',')[0]?.trim() || '';
    const firstChar = names?.[0]?.toUpperCase() || '';
    const lastChar = this.user.lastName?.[0]?.toUpperCase() || '';
    return `${firstChar}${lastChar}`;
  }

  public startEdit() {
    // Vérifier que l'utilisateur est autorisé à modifier ce profil
    if (!this.canEditProfile) {
      //this.toastService.error('Vous n\'êtes pas autorisé à modifier ce profil');
      return;
    }
    this.editableUser = { ...this.user };
    this.isEditing = true;
  }

  public cancelEdit() {
    this.isEditing = false;
  }

  public confirmSave() {
    if (!this.displayedUserId) {
      //this.toastService.error('Erreur: ID utilisateur non trouvé');
      return;
    }

    // Mapping du UserProfile vers UserUpdateInput - complet avec adresses
    const updatePayload: any = {
      first_names: this.editableUser.firstNames?.split(',').map(n => n.trim()) || [],
      last_name: this.editableUser.lastName || null,
      gender: this.editableUser.gender || null,
      birth_date: this.editableUser.birthDate || null,
      nationality: this.editableUser.nationality || [],
      totem: this.editableUser.totem || null,
      contact: {
        email: this.editableUser.email || null,
        phone: this.editableUser.phone || null,
      },
      home_address: {
        thoroughfare: this.editableUser.street || '',
        box_number: this.editableUser.boxNumber || null,
        post_name: this.editableUser.city || '',
        post_code: this.editableUser.zipCode || '',
        country: this.editableUser.country || '',
      }
    };

    // Ajouter l'adresse résidentielle si elle existe
    if (this.editableUser.residentialStreet) {
      updatePayload.residential_address = {
        thoroughfare: this.editableUser.residentialStreet,
        box_number: this.editableUser.residentialBoxNumber || null,
        post_name: this.editableUser.residentialCity || '',
        post_code: this.editableUser.residentialZipCode || '',
        country: this.editableUser.residentialCountry || '',
      };
    }

    // Activer le spinner de sauvegarde
    this.isSavingUpdate = true;
    this.cdr.markForCheck();

    this.userService.updateUser(this.displayedUserId, updatePayload).subscribe({
      next: () => {
        this.user = { ...this.editableUser };
        this.isEditing = false;
        this.isConfirmingUpdate = false;
        this.isSavingUpdate = false;
        // Forcer la détection de changement pour que l'UI se mette à jour immédiatement
        this.cdr.markForCheck();
        //this.toastService.success('Profil mis à jour avec succès');
      },
      error: (err) => {
        // console.error('Erreur lors de la mise à jour du profil:', err);
        // console.error('Réponse du serveur:', err.error);
        this.isConfirmingUpdate = false;
        this.isSavingUpdate = false;
        // Forcer la détection de changement même en cas d'erreur
        this.cdr.markForCheck();
        //this.toastService.error('Erreur lors de la mise à jour du profil');
      }
    });
  }

  public cancelConfirm() {
    this.isConfirmingUpdate = false;
    this.cdr.markForCheck();
  }
  
  public save() {
    this.isConfirmingUpdate = true;
    this.cdr.markForCheck();
  }
}