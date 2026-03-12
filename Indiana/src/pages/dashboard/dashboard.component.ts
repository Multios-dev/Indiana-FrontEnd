import { Component } from '@angular/core';
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard.component',
  imports: [
    RouterModule,
    TranslateModule, 
    TranslatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {

}
