import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";
import { AuthService } from '../services/auth.service';
import { SidebarService } from '../services/sidebar.service';
// import 'primeicons/primeicons.css';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    NgxSpinnerModule, 
    RouterOutlet,
    Sidebar, 
    TranslateModule, 
    TranslatePipe  
    ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Indiana');
  
  private authService = inject(AuthService);
  public sidebarService = inject(SidebarService);

  public constructor() {
    // Fermer la sidebar quand l'utilisateur se déconnecte
    effect(() => {
      if (!this.authService.loggedIn()) {
        this.sidebarService.closeSidebar();
      }
    });
  }

  public get isLoggedIn(): boolean {
    return !!this.authService.getUserId();
  }

  public get showSidebar(): boolean {
    return this.isLoggedIn;
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  get sidebarOpen(): boolean {
    return this.sidebarService.sidebarOpen();
  }
}