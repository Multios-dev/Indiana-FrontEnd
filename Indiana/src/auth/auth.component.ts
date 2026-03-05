import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-auth-area',
  imports: [CommonModule],
  template: '<h2>Zone protégée</h2><p>Vous êtes authentifié.</p>',
})
export class AuthComponent {}
