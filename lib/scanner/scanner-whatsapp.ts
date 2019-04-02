import { Scanner } from './scanner';
import { PatternsWhatsApp, LocaleWhatsApp, FileInfo, ParsedMessage, Message } from '../../index';

export class ScannerWhatsApp extends Scanner<PatternsWhatsApp, LocaleWhatsApp> {
  // tracking which date is currently being scanned
  private currentDate: string;

  constructor(protected readonly source: string[], protected readonly fileInfo: FileInfo) {
    super(source, fileInfo);

    this.currentDate = '';
    this.setChatName();
  }

  /**
   * Set chat name by looking at the first line of file.
   * If it's from iOS, it's possible to get the name since the sender name is always in the first line.
   *
   * Yet for Android, we would not able to get any info of chat name since there is no sender name
   * in the first line.
   * We make guess by looking at the second line, and get the sender name from there.
   *
   * // TODO: there are info we could gather by scanning the entire chat to determine the chat name, work on it!
   */
  private setChatName() {
    let startIndex = this.fileInfo.osType == 'ios' ? 0 : 1;
    let firstLine = this.source[startIndex].match(this.regexStore.encryptionNotification);
    if (firstLine) {
      this.data.chatName = firstLine[2];
    }
  }

  /**
   * Parse attached media data if it's Android.
   * @param regex regex name in regexStore
   * @param match regex match array of line that contains attached media
   */
  private parseAttachedMediaAndroid(regex: string, match: RegExpMatchArray) {
    let additionalInfo: { [key: string]: string } = {
      fullFileName: '',
      fileID: '',
      fileType: '',
      fileName: '',
      contactName: '',
      fileExtension: ''
    };

    [additionalInfo.fullFileName, additionalInfo.fileType] = match.slice(3);

    if (regex == 'attachedMedia') {
      additionalInfo.fileExtension = match[7];
      additionalInfo.fileID = match[6];
    } else if (regex == 'attachedContact') {
      additionalInfo.fileExtension = match[5];
      additionalInfo.contactName = match[4];
    } else if (regex == 'attachedDocument') {
      additionalInfo.fileExtension = match[4];
    }

    // filter only gathered data
    let finalInfo: { [key: string]: string } = {};
    for (let info in additionalInfo) {
      if (additionalInfo[info]) {
        finalInfo[info] = additionalInfo[info];
      }
    }

    // return filtered data
    return finalInfo;
  }

  /**
   * Parse attached media data if it's iOS
   * @param regex regex name in regexStore
   * @param match regex match array of line that contains attached media
   */
  private parseAttachedMediaIOS(regex: string, match: RegExpMatchArray) {
    let additionalInfo: { [key: string]: string } = {
      fullFileName: '',
      fileID: '',
      fileType: '',
      fileName: '',
      contactName: '',
      fileExtension: ''
    };

    if (regex == 'attachedMedia') {
      let fileInfo = match.slice(4);
      [additionalInfo.fullFileName, additionalInfo.fileID, additionalInfo.fileType] = fileInfo;
      additionalInfo.fileExtension = fileInfo[9];
    }

    if (regex == 'attachedDocument') {
      let fileInfo = match.slice(5);
      [
        additionalInfo.fullFileName,
        additionalInfo.fileID,
        additionalInfo.fileName,
        additionalInfo.fileExtension
      ] = fileInfo.slice();
    }

    if (regex == 'attachedContact') {
      let fileInfo = match.slice(4);
      [
        additionalInfo.fullFileName,
        additionalInfo.fileID,
        additionalInfo.contactName,
        additionalInfo.fileExtension
      ] = fileInfo;
    }

    // filter only gathered data
    let finalInfo: { [key: string]: string } = {};
    for (let info in additionalInfo) {
      if (additionalInfo[info]) {
        finalInfo[info] = additionalInfo[info];
      }
    }

    // return filtered data
    return finalInfo;
  }

  /**
   * Scan by looking each line.
   */
  scan(): ParsedMessage {
    while (this.index != this.source.length - 1) {
      let line = this.source[this.index];
      let match;
      let hasMatched = false;

      // match current line by each of regexes in the regex store
      for (let regex in this.regexStore) {
        if ((match = line.match(this.regexStore[regex]))) {
          hasMatched = true;
          let dateSent, sender, messageContent;

          [dateSent, sender, messageContent] = match.slice(1);
          // since on Android first line does not contain sender name,
          // we set sender to '' to avoid sender being incorrectly assigned value of messageContent
          // thus messageContent should be in match[2]
          if (this.index == 0 && this.fileInfo.osType == 'android') {
            sender = '';
            messageContent = match[2];
          }

          // dateSent contains space that separates between current date and time
          let dateBegin = dateSent.split(' ')[0];

          // storing sender name
          if (this.data.chatParticipants.indexOf(sender) < 0 && sender != '') {
            this.data.chatParticipants.push(sender);
          }

          let messageLineData: Message = {
            dateSent,
            sender,
            messageContent,
            messageType: regex
          };

          // if current line is of attached-* type,
          // parse the attached-* data
          if (regex.match(/^attached/)) {
            messageLineData.additionalInfo =
              this.fileInfo.osType == 'ios'
                ? this.parseAttachedMediaIOS(regex, match)
                : this.parseAttachedMediaAndroid(regex, match);
          }

          // grouping messages by date begin
          if (this.currentDate !== dateBegin) {
            this.data.groups.push({
              dateBegin,
              messages: [messageLineData]
            });
            this.currentDate = dateBegin;
          } else {
            this.data.groups[this.data.groups.length - 1].messages.push(messageLineData);
          }

          this.data.totalMessages++;
          break;
        }
      }

      // if none of regex has matched, sure it's a message continuation of previous line
      if (!hasMatched) {
        let groups = this.data.groups;
        let currentGroup = groups[groups.length - 1];
        let messages = currentGroup.messages;
        messages[messages.length - 1].messageContent += '\n' + line;
      }

      this.index++;
    }

    return this.data;
  }
}
