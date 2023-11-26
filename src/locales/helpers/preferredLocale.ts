import { getLocales } from 'react-native-localize';

/* -> [
  { countryCode: "GB", languageTag: "en-GB", languageCode: "en", isRTL: false },
  { countryCode: "US", languageTag: "en-US", languageCode: "en", isRTL: false },
  { countryCode: "FR", languageTag: "fr-FR", languageCode: "fr", isRTL: false },
] */
export const preferredLocale = getLocales()[0];

export const inChina = preferredLocale.countryCode === 'CN';
