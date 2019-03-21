import { FileInfo } from './../parser/parser';
import { LocaleWhatsApp } from './../patterns/whatsapp/locales/locale-whatsapp';
import { Scanner, Message } from './scanner';
import { PatternsWhatsApp } from './../patterns/whatsapp/patterns-whatsapp';

export class ScannerWhatsApp extends Scanner<PatternsWhatsApp, LocaleWhatsApp> {
  // tracking which date is currently being scanned
  private currentDate: string;

  constructor(protected readonly source: string[], protected readonly fileInfo: FileInfo) {
    super(source, fileInfo);

    this.currentDate = '';
    this.setChatName();
  }

  private setChatName() {
    let startIndex = this.fileInfo.osType == 'ios' ? 0 : 1;
    let firstLine = this.source[startIndex].match(this.regexStore.encryptionNotification);
    if (firstLine) {
      this.data.chatName = firstLine[2];
    }
  }

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
    //additionalInfo.fullFileName = additionalInfo.fileName + '.' + additionalInfo.fileExtension;
    //additionalInfo.fileExtension = match[7];

    if (regex == 'attachedMedia') {
      additionalInfo.fileExtension = match[7];
      additionalInfo.fileID = match[6];
    } else if (regex == 'attachedContact') {
      additionalInfo.fileExtension = match[5];
      additionalInfo.contactName = match[4];
    } else if (regex == 'attachedDocument') {
      additionalInfo.fileExtension = match[4];
    }

    let finalInfo: { [key: string]: string } = {};
    for (let info in additionalInfo) {
      if (additionalInfo[info]) {
        finalInfo[info] = additionalInfo[info];
      }
    }

    return finalInfo;
  }

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

    let finalInfo: { [key: string]: string } = {};
    for (let info in additionalInfo) {
      if (additionalInfo[info]) {
        finalInfo[info] = additionalInfo[info];
      }
    }

    return finalInfo;
  }

  scan() {
    while (this.index != this.source.length - 1) {
      let line = this.source[this.index];
      let match;
      let hasMatched = false;

      for (let regex in this.regexStore) {
        if ((match = line.match(this.regexStore[regex]))) {
          hasMatched = true;
          let dateSent, sender, messageContent;

          [dateSent, sender, messageContent] = match.slice(1);
          if (this.index == 0 && this.fileInfo.osType == 'android') {
            sender = '';
            messageContent = match[2];
          }

          let dateBegin = dateSent.split(' ')[0];

          if (this.data.chatParticipants.indexOf(sender) < 0 && sender != '') {
            this.data.chatParticipants.push(sender);
          }

          let messageLineData: Message = {
            dateSent,
            sender,
            messageContent,
            messageType: regex
          };

          if (regex.match(/^attached/)) {
            messageLineData.additionalInfo =
              this.fileInfo.osType == 'ios'
                ? this.parseAttachedMediaIOS(regex, match)
                : this.parseAttachedMediaAndroid(regex, match);
          }

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
