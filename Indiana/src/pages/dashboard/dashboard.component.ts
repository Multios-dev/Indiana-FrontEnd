import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { UserUtilService } from '../../services/user-util.service';
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
  private userUtilService = inject(UserUtilService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  //remplacé par un booléen le signal et une simple liste pour les minors au lieu d'un signal
  public minors: UserOutput[] = [];
  public isLoadingMinors = false;

  public ngOnInit(): void {
    this.loadMinors();
  }

  private loadMinors(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }
    this.isLoadingMinors = true;
    this.userService.getMinorsUsersById(userId).subscribe({
      next: (minorsData: UserOutput[]) => {
        this.minors = minorsData || [];
        this.isLoadingMinors = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des mineurs:', err);
        this.minors = [];
        this.isLoadingMinors = false;
        this.cdr.detectChanges();
      }
    });
  }
  public getInitials(minor: UserOutput): string {
    return this.userUtilService.getInitials(minor);
  }

  /**
   * Navigate to the profil page of the minor 
   */
  public viewMinorProfile(minorId: string): void {
    // Passer l'ID du mineur en paramètre de route
    this.router.navigate(['/scouts/profile', minorId]);
  }
}
