import { PatternsStore } from './../store/store-patterns';
import { LocalesStore } from '../store/store-locales';
import { RegexBuilder } from '../regex-builder';

/**
 * General Scanner
 */
export class Scanner<
  T extends GenericPattern = GenericPattern,
  U extends GenericLocale = GenericLocale
> {
  // points to current line
  protected index: number;
  // patterns for corresponding app type
  protected readonly patterns: T;
  // parsed data
  protected readonly data: ParsedMessage;
  // used as store for regex for corresponding app type
  protected readonly regexStore: Indexer<RegExp>;

  protected constructor(
    protected readonly source: string[],
    protected readonly fileInfo: FileInfo
  ) {
    this.index = 0;
    this.patterns = PatternsStore.getPatterns<T>(fileInfo.appType, fileInfo.osType);
    this.regexStore = this.buildRegex();
    this.data = { chatName: '', chatParticipants: [], groups: [], totalMessages: 0 };
  }

  /**
   * Build regexes from patterns.
   */
  protected buildRegex() {
    let regexStore: Indexer<RegExp> = {};
    for (let pattern in this.patterns) {
      if (typeof this.patterns[pattern] == 'function') {
        continue;
      }
      let regex = RegexBuilder.build(
        this.patterns[pattern] as string,
        undefined,
        LocalesStore.getLocale<U>(this.fileInfo.appType, this.fileInfo.lang)[pattern]
      );
      regexStore[pattern] = regex;
    }
    return regexStore;
  }

  public getData() {
    return this.data;
  }
}
