/**
 * Mapper pour les pays
 * Convertit entre les codes pays ISO (ex: "BE") et les noms affichables (ex: "Belgique")
 */

export interface Country {
  code: string;
  name: string;
}

export const COUNTRIES_LIST: Country[] = [
  { code: 'BE', name: 'Belgique' },
  // Ajouter d'autres pays ici selon les besoins
];

/**
 * Convertit un code pays ISO en nom affichable
 * @param code Code ISO du pays (ex: "BE")
 * @returns Nom du pays (ex: "Belgique"), ou le code si non trouvé
 */
export function getCountryName(code: string | null | undefined): string {
  if (!code) return '';
  const country = COUNTRIES_LIST.find(c => c.code === code);
  return country ? country.name : code;
}

/**
 * Convertit un nom de pays en code ISO
 * @param name Nom du pays (ex: "Belgique")
 * @returns Code ISO (ex: "BE"), ou le nom si non trouvé
 */
export function getCountryCode(name: string | null | undefined): string {
  if (!name) return '';
  const country = COUNTRIES_LIST.find(c => c.name === name);
  return country ? country.code : name;
}
