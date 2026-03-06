import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
    TranslateModule,
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";
import { NgxSpinnerModule } from 'ngx-spinner';
import { HeaderComponent } from "./header/header";

@Component({
  selector: 'app-root',
  imports: [NgxSpinnerModule, RouterOutlet, TranslateModule, TranslatePipe, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Indiana');
}
