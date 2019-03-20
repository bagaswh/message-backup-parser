import { MinimumLocaleDefinition } from '../../../store/store-locales';

export interface LocaleWhatsApp extends MinimumLocaleDefinition {
  encryptionNotification: string;
  missedCall: string;
  deletedMessage: string;
  attachedContact: string;
  attachedMedia: string;
  attachedDocument: string;
  location: string;
}
