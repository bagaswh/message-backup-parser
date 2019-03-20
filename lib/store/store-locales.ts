/// <reference path="../references.d.ts" />

import { Indexer } from '../types/types';
import { LocaleLINE } from '../patterns/line/locales/locale-line';

export interface MinimumLocaleDefinition {
  firstLineSignature: string;
}

export interface Locale<T extends MinimumLocaleDefinition> extends Indexer<T> {
  // lang: localeDefinition
  // lang: T & MinimumLocaleDefinition
}

let x: Locale<LocaleLINE> = {
  en: {
    firstLineSignature: 'a',
    beginningFile: 'a',
    dateSaved: 'as'
  }
};

export class LocalesStore {
  // appName: Locale<T>
  private static readonly store: Indexer<Locale<{} & MinimumLocaleDefinition>> = {};

  public static defineLocale<T extends MinimumLocaleDefinition = MinimumLocaleDefinition>(
    appName: string,
    localeLang: string,
    value: T
  ) {
    if (!this.store[appName]) {
      this.store[appName] = {};
    }
    this.store[appName][localeLang] = value;
    return this.store[appName][localeLang];
  }

  public static getAllLocales() {
    return this.store;
  }

  public static getLocalesByAppName(appName: string) {
    return this.store[appName];
  }

  public static getLocalesByLang(lang: string) {
    let locales: Indexer<object> = {};
    for (let appName in this.store) {
      for (let langInLocale in this.store[appName]) {
        if (lang != langInLocale) {
          continue;
        }

        if (!locales[appName]) {
          locales[appName] = {};
        }
        locales[appName] = { [lang]: this.store[appName][lang] };
      }
    }

    return locales;
  }

  public static getLocale<T extends MinimumLocaleDefinition = MinimumLocaleDefinition>(
    appName: string,
    localeLang: string
  ): T {
    return this.store[appName][localeLang] as T;
  }
}

const context = require.context('../patterns', true, /\/locales\/.*.ts/);
context.keys().forEach((key: string) => {
  context(key);
});

//Promise.resolve(1).then(() => console.log(LocalesStore.getAllLocales()));
