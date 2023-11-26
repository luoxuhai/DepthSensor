import i18n from 'i18next';

import { SupportedLanguage } from './constants';
import { preferredLocale } from './helpers/preferredLocale';
import zh, { Translations } from './zh';
import en from './en';

const supportedLngs = [SupportedLanguage.ZH, SupportedLanguage.EN];

const lng = supportedLngs.find((language) =>
  preferredLocale.languageCode.startsWith(language.split('-')[0]),
);

i18n.init({
  compatibilityJSON: 'v3',
  debug: false,
  lng,
  fallbackLng: SupportedLanguage.EN,
  supportedLngs,
  resources: {
    [SupportedLanguage.EN]: {
      translation: en,
    },
    [SupportedLanguage.ZH]: {
      translation: zh,
    },
  },
});

export { i18n };

/**
 * Builds up valid keypaths for translations.
 */
export type TextKeyPath = RecursiveKeyOf<Translations>;

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>;
}[keyof TObj & (string | number)];

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >;
}[keyof TObj & (string | number)];

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text;
