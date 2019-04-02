import { Scanner } from './scanner';
import { PatternsLINE, LocaleLINE, FileInfo, ParsedMessage, MessageGroup } from '../../index';

export class ScannerLINE extends Scanner<PatternsLINE, LocaleLINE> {
  constructor(protected readonly source: string[], protected readonly fileInfo: FileInfo) {
    super(source, fileInfo);

    this.data.dateSaved = '';

    this.setChatName();
    this.setSavedDate();
  }

  private setChatName() {
    let firstLine = this.source[this.index++].match(this.regexStore.beginningFile);
    if (firstLine) {
      this.data.chatName = firstLine[1];
    }
  }

  /**
   * Some files include few strings after chat name string.
   * Regex matches those string and captured in groups, thus get assigned into chat name,
   * which makes chat name incorrect.
   *
   * This function guesses the best name by checking and comparing every names that have been stored
   * during scanning to the assigned chat name.
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
    let src = this.source[this.index++];
    let secondLine = this.patterns.toDateSavedString(src.match(this.regexStore.dateSaved));
    if (secondLine) {
      this.data.dateSaved = secondLine;
    }
    this.index++;
  }

  scan(): ParsedMessage {
    while (this.index != this.source.length - 1) {
      this.data.groups.push(this.scanMessagesInGroup());
    }
    this.matchChatName();

    return this.data;
  }

  // message groups are grouped by date
  private scanMessagesInGroup() {
    let messagesInGroup: MessageGroup = { dateBegin: '', messages: [] };

    let dateBegin = this.patterns.toDateBeginString(this.source[this.index++].match(
      this.regexStore.dateBegin
    ) as RegExpMatchArray);

    messagesInGroup.dateBegin = dateBegin;

    // message group ends if pointer (this.index) finds dateBegin string
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
