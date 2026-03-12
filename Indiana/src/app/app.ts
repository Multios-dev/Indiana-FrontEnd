import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslatePipe } from "@ngx-translate/core";
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent } from "./header/header";
import { Sidebar } from "./sidebar/sidebar";

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
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}