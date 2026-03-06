import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private _translate = inject(TranslateService);

  langs = ['fr', 'en', 'nl'];
  currentLang = signal(this._translate.currentLang ?? 'fr');

  langLabels: Record<string, string> = {
    fr: '🇫🇷 FR',
    en: '🇬🇧 EN',
    nl: '🇧🇪 NL'
  };

  switchLang(lang: string) {
    this._translate.use(lang);
    this.currentLang.set(lang);
  }
}