import { MinimumPatternDefinition } from './../../store/store-patterns';
import { Pattern, PatternsStore } from '../../store/store-patterns';
import { Indexer } from '../../types/types';

interface DateTransformer {
  (match: RegExpMatchArray): string;
}

export interface PatternsLINE extends MinimumPatternDefinition, Indexer<string | DateTransformer> {
  firstLineSignature: string;

  beginningFile: string;
  dateSaved: string;
  dateBegin: string;
  messageLine: string;
  alternateMessageLine: string;

  toDateBeginString(match: RegExpMatchArray): string;
  toDateSavedString(match: RegExpMatchArray): string;
}

export const PatternsLINE: Pattern<PatternsLINE> = {
  ios: {
    firstLineSignature: '\\[LINE\\] {{fs}} ([\\S\\s]+)',
    beginningFile: '\\[LINE\\] {{fs}} ([\\S\\s]+)',
    dateSaved: '{{fs}}(?:\\:|：) ?((\\d{1,2})\\/(\\d{1,2})\\/(\\d{4,})) (\\d{1,2}\\.\\d{1,2})',
    dateBegin: '(\\w+)\\, ((\\d{1,2})\\/(\\d{1,2})\\/(\\d{4,}))',
    messageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+)\\t([\\S\\s]+)',
    alternateMessageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+? left the chat.)',

    toDateBeginString(match: RegExpMatchArray) {
      return `${match[1]}, ${match[4]}/${match[3]}/${match[5]}`;
    },
    toDateSavedString(match: RegExpMatchArray) {
      return `${match[3]}/${match[2]}/${match[4]} ${match[5].replace('.', ':')}`;
    }
  },

  android: {
    firstLineSignature: '{{fs}} ([\\S\\s]+)( ?:\\[LINE\\])?',
    beginningFile: '{{fs}} ([\\S\\s]+)( ?:\\[LINE\\])?',
    dateSaved: '{{fs}}(?:\\:|：) ?((\\d{4})\\/(\\d{1,2})\\/(\\d{1,2})) (\\d{1,2}\\:\\d{1,2})',
    dateBegin: '((\\d{4})/(\\d{1,2})/(\\d{1,2}))\\((\\w+)',
    messageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+)\\t([\\S\\s]+)',
    alternateMessageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+?) left the chat.',

    toDateBeginString(match: RegExpMatchArray) {
      return `${match[5]}, ${match[3]}/${match[4]}/${match[2]}`;
    },
    toDateSavedString(match: RegExpMatchArray) {
      return `${match[3]}/${match[4]}/${match[2]} ${match[5]}`;
    }
  }
};

PatternsStore.definePatterns('line', PatternsLINE);
