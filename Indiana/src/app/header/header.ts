import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ShortLanguages } from '../../enum/languages.enum';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private _translate = inject(TranslateService);

  public currentLang = signal(this._translate.currentLang ?? ShortLanguages.FR);

  // Liste des langues disponibles (retire IT si pas de nl.json etc.)
  public langList = [ShortLanguages.FR, ShortLanguages.EN, ShortLanguages.NL];

  public langFlags: Record<string, string> = {
    [ShortLanguages.FR]: "",
    [ShortLanguages.EN]: '',
    [ShortLanguages.NL]: '',
  };

  switchLang(lang: ShortLanguages) {
    this._translate.use(lang);
    this.currentLang.set(lang);
  }
}