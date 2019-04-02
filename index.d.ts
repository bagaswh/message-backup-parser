/// <reference types="typescript" />

/**
 * Used for indexing.
 */
interface Indexer<T> {
  [index: string]: T;
  [index: number]: T;
}

/**
 * Types of apps and OS.
 */

type AppType = 'line' | 'whatsapp';
type OSType = 'ios' | 'android';

/**
 * Backup file info.
 */

interface FileInfo {
  appType: AppType | null;
  osType: OSType | null;
  lang: string | null;
}

/**
 * Locales and Patterns.
 */

type GenericLocale = MinimumLocaleDefinition & Indexer<string>;
type GenericPattern = MinimumPatternDefinition & Indexer<string | DateTransformer>;

interface Locale<T extends MinimumLocaleDefinition> extends Indexer<T> {
  // lang: localeDefinition
  // lang: T & MinimumLocaleDefinition
}

interface Pattern<T extends MinimumPatternDefinition> extends Indexer<T> {
  ios: T;
  android: T;
}

interface MinimumLocaleDefinition {
  firstLineSignature: string;
}

interface MinimumPatternDefinition {
  firstLineSignature: string;
}

interface LocaleLINE extends MinimumLocaleDefinition, Indexer<string> {
  beginningFile: string;
  dateSaved: string;
}

interface LocaleWhatsApp extends MinimumLocaleDefinition, Indexer<string> {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}

interface DateTransformer {
  (match: RegExpMatchArray): string;
}

interface PatternsLINE extends MinimumPatternDefinition, Indexer<string | DateTransformer> {
  firstLineSignature: string;

  beginningFile: string;
  dateSaved: string;
  dateBegin: string;
  messageLine: string;
  alternateMessageLine: string;

  toDateBeginString(match: RegExpMatchArray): string;
  toDateSavedString(match: RegExpMatchArray): string;
}

interface PatternsWhatsApp extends MinimumPatternDefinition, Indexer<string | DateTransformer> {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  regularMessageLine: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}

/**
 * Parsed message data.
 */

interface Message {
  dateSent: string;
  messageContent: string;
  messageType?: string;
  sender?: string;
  additionalInfo?: { [key: string]: string };
}

interface MessageGroup {
  dateBegin: string;
  messages: Message[];
}

interface ParsedMessage {
  chatName: string;
  chatParticipants: string[];
  groups: MessageGroup[];
  totalMessages: number;
  dateSaved?: string;
}
