import { Component, Input, inject, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { UserOutput } from '../../models/user-output';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    TranslateModule, 
    TranslatePipe  
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
   @Input() isOpen = false;
  @Input() activeRoute = 'dashboard';

  private authService = inject(AuthService);
  private router = inject(Router);

  public currentUser = signal<UserOutput | null>(null);

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    this.authService.getCurrentUserInfo().subscribe({
      next: (userInfo: UserOutput) => {
        this.currentUser.set(userInfo);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des infos utilisateur:', err);
      }
    });
  }

  public get initials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const firstName = user.first_names?.[0]?.charAt(0).toUpperCase() || '';
    const lastName = user.last_name?.charAt(0).toUpperCase() || '';
    return firstName + lastName;
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
