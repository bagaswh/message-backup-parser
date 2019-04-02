/// <reference path="../references.d.ts" />

import { Indexer, Pattern, MinimumPatternDefinition, AppType, OSType } from '../../index';

export class PatternsStore {
  // appName: Pattern<T>
  private static readonly store: Indexer<Pattern<{} & MinimumPatternDefinition>> = {};

  public static definePatterns<T extends MinimumPatternDefinition = MinimumPatternDefinition>(
    name: AppType,
    value: Pattern<T>
  ) {
    if (!this.store[name]) {
      this.store[name] = value;
    }

    return this.store[name];
  }

  public static getAllPatterns() {
    return this.store;
  }

  public static getPatterns<T extends MinimumPatternDefinition = MinimumPatternDefinition>(
    appType: AppType,
    osType: OSType
  ): T {
    let app = this.store[appType];
    if (app) {
      return app[osType] as T;
    }

    return null;
  }
}

const context = require.context('../patterns', true, /^((?![\\/]locales[\\/]).)*\.ts$/);
context.keys().forEach((key: string) => {
  context(key);
});
