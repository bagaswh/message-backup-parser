import { PatternsStore } from './../../store/store-patterns';
import { Pattern, PatternsLINE } from '../../../index';

export const PatternsLINEDefinition: Pattern<PatternsLINE> = {
  ios: {
    firstLineSignature: '\\[LINE\\] {{fs}} ([\\S\\s]+)',
    beginningFile: '\\[LINE\\] {{fs}} ([\\S\\s]+)',
    dateSaved: '{{fs}}(?:\\:|：) ?((\\d{1,2})\\/(\\d{1,2})\\/(\\d{4,})) (\\d{1,2}\\.\\d{1,2})',
    dateBegin: '(\\w+)\\, ((\\d{1,2})\\/(\\d{1,2})\\/(\\d{4,}))',
    messageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+)\\t([\\S\\s]+)',
    alternateMessageLine: '(\\d{1,2}\\:\\d{1,2})\\t([\\S\\s]+? left the chat.)',

    toDateBeginString(match: RegExpMatchArray) {
      return new Date(`${match[1]}, ${match[4]}/${match[3]}/${match[5]}`).toDateString();
    },
    toDateSavedString(match: RegExpMatchArray) {
      return new Date(
        `${match[3]}/${match[2]}/${match[4]} ${match[5].replace('.', ':')}`
      ).toDateString();
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
      return new Date(`${match[5]}, ${match[3]}/${match[4]}/${match[2]}`).toDateString();
    },
    toDateSavedString(match: RegExpMatchArray) {
      return new Date(`${match[3]}/${match[4]}/${match[2]} ${match[5]}`).toDateString();
    }
  }
};

PatternsStore.definePatterns('line', PatternsLINEDefinition);
