import { MinimumPatternDefinition, PatternsStore } from './../../store/store-patterns';
import { Pattern } from '../../store/store-patterns';

export interface PatternsWhatsApp extends MinimumPatternDefinition {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  regularMessageLine: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}

// up-to sender name (semicolon/dash included)
let iOSMessageLineStructure =
  '\\[(\\d{1,2}\\/\\d{1,2}\\/\\d{1,2} \\d{1,2}.\\d{1,2}.\\d{1,2})\\] ([\\S\\s]+?):';
let androidMessageLineStructureNoSender = '(\\d{1,2}\\/\\d{1,2}\\/\\d{1,2} \\d{1,2}.\\d{1,2}) - ';
let androidMessageLineStructureWithSender =
  '(\\d{1,2}\\/\\d{1,2}\\/\\d{1,2} \\d{1,2}.\\d{1,2}) - ([\\S\\s]+): ';

let invisibleSeparator = '\u200e';
// windows | unix
let newLine = '\\r\\n|\\n';

export const PatternsWhatsApp: Pattern<PatternsWhatsApp> = {
  ios: {
    firstLineSignature: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    encryptionNotification: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    missedCall: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    deletedMessage: `${iOSMessageLineStructure} ${invisibleSeparator}({{fs}})`,
    attachedContact: `${invisibleSeparator}${iOSMessageLineStructure} ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?).(vcf)))>`,
    attachedDocument: `${invisibleSeparator}${iOSMessageLineStructure} ([\\S\\s]+)? ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?).([a-z0-9]+)))>`,
    attachedMedia: `${invisibleSeparator}${iOSMessageLineStructure} ${invisibleSeparator}<({{fs}}: ((\\d{8})-([\\S\\s]+?)(?:-(\\d{4})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2})-(\\d{1,2}))?.([a-z0-9]+)))>`,
    location: `${iOSMessageLineStructure} ([\\S\\s]+): (https://maps.google.com/[\\S\\s]+)`,
    regularMessageLine: `${iOSMessageLineStructure} ([\\S\\s]+)`
  },

  android: {
    firstLineSignature: `${androidMessageLineStructureNoSender}({{fs}})`,
    encryptionNotification: `${androidMessageLineStructureNoSender}({{fs}})`,
    missedCall: `${androidMessageLineStructureWithSender}({{fs}})`,
    deletedMessage: `${androidMessageLineStructureWithSender}({{fs}})`,
    attachedContact: `${androidMessageLineStructureWithSender}${invisibleSeparator}([\\S\\s]+).vcf ({{fs}})`,
    attachedDocument: `${androidMessageLineStructureWithSender}${invisibleSeparator}([\\S\\s]+).([a-z0-9]+) ({{fs}})`,
    attachedMedia: `${androidMessageLineStructureWithSender}${invisibleSeparator}(([\\S\\s]+)-(\\d{8})-(\\d{6}).([a-z0-9]+)) ({{fs}})`,
    location: `[\\S\\s]${newLine}[\\S\\s]${newLine}{{fs}} : [\\S\\s]`,
    regularMessageLine: `${androidMessageLineStructureWithSender}([\\S\\s]+)`
  }
};

PatternsStore.definePatterns('whatsapp', PatternsWhatsApp);
