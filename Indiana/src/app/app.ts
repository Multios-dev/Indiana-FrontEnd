import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
    TranslateModule,
    TranslateService,
    TranslatePipe,
    TranslateDirective
} from "@ngx-translate/core";
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  imports: [NgxSpinnerModule, RouterOutlet,TranslateModule,TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Indiana');
  private _translate = inject(TranslateService);

    constructor() {
        this._translate.addLangs(['en', 'fr']);
        this._translate.setFallbackLang('fr');
        this._translate.use('fr');
    }
}
