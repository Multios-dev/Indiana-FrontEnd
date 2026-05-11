import { Pipe, PipeTransform } from '@angular/core';
import { ShortLanguages, LanguageFlags } from '../enum/languages.enum';

@Pipe({
  name: 'languageFlag',
  standalone: true
})
export class LanguageFlagPipe implements PipeTransform {
  /**
   * Convertit une langue courte en son drapeau correspondant
   * @param language La langue courte (fr, en, nl)
   * @returns Le drapeau emoji de la langue
   */
  transform(language: ShortLanguages | string): string {
    const lang = language as ShortLanguages;
    return LanguageFlags[lang] || language;
  }
}
