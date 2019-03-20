import { LocaleLINE } from './../patterns/line/locales/locale-line';
import { LocalesStore } from './../store/store-locales';
import { PatternsStore } from './../store/store-patterns';
import { PatternsLINE } from './../patterns/line/patterns-line';
import { ParsedMessage, MessageGroup } from './scanner';
import { Indexer } from '../types/types';
import { FileInfo } from '../parser/parser';
import { RegexBuilder } from '../regex-builder';

export class ScannerLINE {
  private index: number;
  private readonly patterns: PatternsLINE;
  private readonly data: ParsedMessage;
  private readonly regexStore: Indexer<RegExp>;

  constructor(private readonly source: string[], private readonly fileInfo: FileInfo) {
    this.index = 0;
    this.patterns = PatternsStore.getPatterns<PatternsLINE>('line', fileInfo.osType);
    this.regexStore = this.buildRegex();
    this.data = { chatName: '', chatParticipants: [], dateSaved: '', groups: [], totalMessages: 0 };

    this.setChatName();
    this.setSavedDate();
  }

  private buildRegex() {
    let regexStore: Indexer<RegExp> = {};
    for (let pattern in this.patterns) {
      if (typeof this.patterns[pattern] == 'function') {
        continue;
      }
      let regex = RegexBuilder.build(
        this.patterns[pattern] as string,
        undefined,
        LocalesStore.getLocale<LocaleLINE>(this.fileInfo.appType, this.fileInfo.lang)[pattern]
      );
      regexStore[pattern] = regex;
    }
    return regexStore;
  }

  private setChatName() {
    let firstLine = this.source[this.index++].match(this.regexStore.beginningFile);
    if (firstLine) {
      this.data.chatName = firstLine[1];
    }
  }

  /**
   * Some files include a few strings after chat name string.
   * Regex matches those string and captured in groups, which makes chat name incorrect.
   * This function guesses the best name by checking and comparing every names that have been stored
   * during scanning to the regex-matched string.
   */
  private matchChatName() {
    this.data.chatParticipants.forEach(chatParticipant => {
      if (this.data.chatName.match(chatParticipant)) {
        this.data.chatName = chatParticipant;
        return;
      }
    });
  }

  private setSavedDate() {
    let secondLine = this.patterns.toDateSavedString(this.source[this.index++].match(
      this.regexStore.dateSaved
    ) as RegExpMatchArray);
    if (secondLine) {
      this.data.dateSaved = secondLine;
    }
    this.index++;
  }

  scan() {
    while (this.index != this.source.length - 1) {
      this.data.groups.push(this.scanMessagesInGroup());
    }
    this.matchChatName();

    return this.data;
  }

  private scanMessagesInGroup() {
    let messagesInGroup: MessageGroup = { dateBegin: '', messages: [] };

    let dateBegin = this.patterns.toDateBeginString(this.source[this.index++].match(
      this.regexStore.dateBegin
    ) as RegExpMatchArray);

    messagesInGroup.dateBegin = dateBegin;

    // message group ends if pointer finds dateBegin string
    while (!this.source[this.index].match(this.regexStore.dateBegin)) {
      // or end of the file
      if (this.index == this.source.length - 1) {
        break;
      }

      let match = this.source[this.index].match(this.regexStore.messageLine);
      if (match) {
        this.data.totalMessages++;

        let [dateSent, sender, messageContent] = match.slice(1, 4);

        // storing sender names
        if (this.data.chatParticipants.indexOf(sender) < 0) {
          this.data.chatParticipants.push(sender);
        }

        messagesInGroup.messages.push({
          dateSent,
          sender,
          messageContent
        });
      }

      // some messages include linebreak
      // read subsequent string after linebreak if the string does not match to messageLine string
      // and append the string to previous messageContent
      if (
        this.source[this.index].match(/[\S\s]/) &&
        !match &&
        messagesInGroup.messages[messagesInGroup.messages.length - 1]
      ) {
        messagesInGroup.messages[messagesInGroup.messages.length - 1].messageContent +=
          '\n' + this.source[this.index];
      }

      // handle special cases such as someone left the chat in group chat
      if (!match && (match = this.source[this.index].match(this.regexStore.alternateMessageLine))) {
        messagesInGroup.messages.push({ dateSent: match[1], messageContent: match[2] });
      }

      this.index++;
    }

    return messagesInGroup;
  }
}
