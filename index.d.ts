/// <reference types="typescript" />

/**
 * Used for indexing.
 */
export interface Indexer<T> {
  [index: string]: T;
  [index: number]: T;
}

/**
 * Types of apps and OS.
 */

export type AppType = 'line' | 'whatsapp';
export type OSType = 'ios' | 'android';

/**
 * Backup file info.
 */

export interface FileInfo {
  appType: AppType | null;
  osType: OSType | null;
  lang: string | null;
}

/**
 * Locales and Patterns.
 */

export type GenericLocale = MinimumLocaleDefinition & Indexer<string>;
export type GenericPattern = MinimumPatternDefinition & Indexer<string | DateTransformer>;

export interface Locale<T extends MinimumLocaleDefinition> extends Indexer<T> {
  // lang: localeDefinition
  // lang: T & MinimumLocaleDefinition
}

export interface Pattern<T extends MinimumPatternDefinition> extends Indexer<T> {
  ios: T;
  android: T;
}

export interface MinimumLocaleDefinition {
  firstLineSignature: string;
}

export interface MinimumPatternDefinition {
  firstLineSignature: string;
}

export interface LocaleLINE extends MinimumLocaleDefinition, Indexer<string> {
  beginningFile: string;
  dateSaved: string;
}

export interface LocaleWhatsApp extends MinimumLocaleDefinition, Indexer<string> {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}

export interface DateTransformer {
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

export interface PatternsWhatsApp
  extends MinimumPatternDefinition,
    Indexer<string | DateTransformer> {
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

/** main module */
export interface ParserStatic {
  new (source: string): ParserInterface;
}

export interface ParserInterface {
  getFileInfo(): FileInfo;
  parse(): ParsedMessage;
}

declare const Parser: ParserStatic;

export { Parser };
