/** Example initialization. Integrate with a preference-loading gate before app render. */
import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ar from './locales/ar.json';
import { resolveLanguage } from './locale';

const devicePrimaryLocale = getLocales()[0];
const primaryLanguage = devicePrimaryLocale?.languageCode ?? devicePrimaryLocale?.languageTag;

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    ar: { translation: ar },
  },
  lng: resolveLanguage(primaryLanguage),
  fallbackLng: 'fr',
  supportedLngs: ['en', 'fr', 'ar'],
  defaultNS: 'translation',
  interpolation: { escapeValue: false }, // React Native escapes textual rendering itself
  initImmediate: false, // Resources are bundled locally; render only after ready
});

export default i18n;
