import { Component, signal, inject, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ShortLanguages } from '../../enum/languages.enum';
import { Button } from "primeng/button";
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-header',
  imports: [CommonModule, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private _translate = inject(TranslateService);
  private authService = inject(AuthService);

  public currentLang = signal(this._translate.getCurrentLang() ?? ShortLanguages.FR);

  public langFlags: Record<string, string> = {
    [ShortLanguages.FR]: "",
    [ShortLanguages.EN]: '',
    [ShortLanguages.NL]: '',
  };
  // List of languages
  public langList = [ShortLanguages.FR, ShortLanguages.EN, ShortLanguages.NL];

  public switchLang(lang: ShortLanguages) {
    this._translate.use(lang);
    this.currentLang.set(lang);
  }
  @Input() sidebarOpen = false;
  @Input() showMenuButton = true;
  @Output() menuToggle = new EventEmitter<void>();

  public get isLoggedIn(): boolean {
    return !!this.authService.getUserId();
  }

  public toggleMenu(): void {
    if (this.isLoggedIn) {
      this.menuToggle.emit();
    }
  }
}