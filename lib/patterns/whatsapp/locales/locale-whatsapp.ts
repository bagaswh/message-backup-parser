import { Indexer } from './../../../types/types.d';
import { MinimumLocaleDefinition } from '../../../store/store-locales';

export interface LocaleWhatsApp extends MinimumLocaleDefinition, Indexer<string> {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}
