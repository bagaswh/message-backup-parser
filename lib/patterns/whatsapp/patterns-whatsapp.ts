import { PatternsStore } from './../../store/store-patterns';
import { Pattern, PatternsWhatsApp } from '../../../index';

/**
 * Defines message patterns of WhatsApp.
 */

// up-to sender name (semicolon/dash included)
let iOSMessageLineStructure =
  '\\[(\\d{1,2}\\/\\d{1,2}\\/\\d{1,2} \\d{1,2}.\\d{1,2}).\\d{1,2}\\] ([\\S\\s]+?):';
let androidMessageLineStructureNoSender =
  '(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}\\,? \\d{1,2}.\\d{1,2}) - ';
let androidMessageLineStructureWithSender =
  '(\\d{1,2}\\/\\d{1,2}\\/\\d{2,4}\\,? \\d{1,2}.\\d{1,2}) - ([\\S\\s]+?): ';

let invisibleSeparator = '\u200e';
// windows | unix
let newLine = '\\r\\n|\\n';

export const PatternsWhatsAppDefinition: Pattern<PatternsWhatsApp> = {
  ios: {
    firstLineSignature: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    encryptionNotification: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    missedCall: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    deletedMessage: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    attachedContact: `${invisibleSeparator}${iOSMessageLineStructure} ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?).(vcf)))>`,
    attachedDocument: `${invisibleSeparator}${iOSMessageLineStructure} ([\\S\\s]+)? ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?).([a-z0-9]+)))>`,
    attachedMedia: `${invisibleSeparator}${iOSMessageLineStructure} ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?)(?:-(\\d{4})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2}))?.([a-z0-9]+)))>`,
    location: `${iOSMessageLineStructure} ([\\S\\s]+): (https://maps.google.com/[\\S\\s]+)`,
    regularMessageLine: `${iOSMessageLineStructure} ([\\S\\s]+)`,

    toDateBeginString(match: RegExpMatchArray) {
      const [, dateSent] = match;
      const date = dateSent.split(' ')[0];
      const parts = date.split('/');
      const str = `${parts[1]}/${parts[0]}/${parts[2]}`;
      return new Date(str).toDateString();
    }
  },

  android: {
    firstLineSignature: `${androidMessageLineStructureNoSender}({{fs}})`,
    encryptionNotification: `${androidMessageLineStructureNoSender}({{fs}})`,
    missedCall: `${androidMessageLineStructureWithSender}({{fs}})`,
    deletedMessage: `${androidMessageLineStructureWithSender}({{fs}})`,
    attachedContact: `${androidMessageLineStructureWithSender}${invisibleSeparator}(([\\S\\s]+?).(vcf)) ({{fs}})`,
    attachedMedia: `${androidMessageLineStructureWithSender}${invisibleSeparator}(([A-Z]{3})-(\\d{8})-(WA\\d{4}).([a-z0-9]+?)) ({{fs}})`,
    attachedDocument: `${androidMessageLineStructureWithSender}${invisibleSeparator}([\\S\\s]+?).([a-z0-9]+?) ({{fs}})`,
    location: `[\\S\\s]${newLine}[\\S\\s]${newLine}{{fs}} : [\\S\\s]`,
    regularMessageLine: `${androidMessageLineStructureWithSender}([\\S\\s]+)`,

    toDateBeginString(match: RegExpMatchArray) {
      const [, dateSent] = match;
      const date = dateSent.split(' ')[0];
      const parts = date.split('/');
      const str = `${parts[1]}/${parts[0]}/${parts[2]}`;
      return new Date(str).toDateString();
    }
  }
};

PatternsStore.definePatterns('whatsapp', PatternsWhatsAppDefinition);
