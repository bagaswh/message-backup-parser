import { DateTransformer } from './../patterns/line/patterns-line';
import { MinimumLocaleDefinition } from './../store/store-locales';
import { PatternsStore, MinimumPatternDefinition } from './../store/store-patterns';
import { FileInfo } from './../parser/parser';
import { Indexer } from './../types/types.d';
import { LocalesStore } from '../store/store-locales';
import { RegexBuilder } from '../regex-builder';

export interface Message {
  dateSent: string;
  messageContent: string;
  messageType?: string;
  sender?: string;
  additionalInfo?: { [key: string]: string };
}

export interface MessageGroup {
  dateBegin: string;
  messages: Message[];
}

export interface ParsedMessage {
  chatName: string;
  chatParticipants: string[];
  groups: MessageGroup[];
  totalMessages: number;
  dateSaved?: string;
}

type GenericPattern = MinimumPatternDefinition & Indexer<string | DateTransformer>;
type GenericLocale = MinimumLocaleDefinition & Indexer<string>;

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
