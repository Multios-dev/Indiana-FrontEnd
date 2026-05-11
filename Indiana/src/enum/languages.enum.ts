export enum Languages {
    'fr' = 'fr-FR',
    'en' = 'en-US',
    'nl' = 'nl-NL',
}

export enum ShortLanguages {
    FR = 'fr',
    EN = 'en',
    NL = 'nl',
}

/**
 * Record mappe les langues courtes à leurs drapeaux
 */
export const LanguageFlags: Record<ShortLanguages, string> = {
    [ShortLanguages.FR]: '🇫🇷',
    [ShortLanguages.EN]: '🇬🇧',
    [ShortLanguages.NL]: '🇳🇱',
};