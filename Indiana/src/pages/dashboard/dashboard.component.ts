import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserOutput } from '../../models/user-output';

@Component({
  selector: 'app-dashboard.component',
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule, 
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  minors = signal<UserOutput[]>([]);
  isLoadingMinors = signal(false);

  ngOnInit(): void {
    this.loadMinors();
  }

  private loadMinors(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    this.isLoadingMinors.set(true);
    this.userService.getMinorsUsersById(userId).subscribe({
      next: (minorsData: UserOutput[]) => {
        this.minors.set(minorsData || []);
        this.isLoadingMinors.set(false);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des mineurs:', err);
        this.minors.set([]);
        this.isLoadingMinors.set(false);
      }
    });
  }

  /**
   * Génère les initiales d'un mineur
   */
  getInitials(minor: UserOutput): string {
    const firstChar = minor.first_names?.[0]?.[0]?.toUpperCase() || '';
    const lastChar = minor.last_name?.[0]?.toUpperCase() || '';
    return `${firstChar}${lastChar}`;
  }

  /**
   * Navigue vers la page de profil du mineur
   */
  viewMinorProfile(minorId: string): void {
    // Passer l'ID du mineur en paramètre de route
    this.router.navigate(['/scouts/profile', minorId]);
  }
}
