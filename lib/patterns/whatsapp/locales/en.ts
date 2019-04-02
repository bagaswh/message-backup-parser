import { LocaleWhatsApp } from './../../../../index.d';
/**
 * Defines locale for WhatsApp.
 */

import { LocalesStore } from '../../../store/store-locales';

LocalesStore.defineLocale<LocaleWhatsApp>('whatsapp', 'en', {
  firstLineSignature:
    'Messages to this chat and calls are now secured with end-to-end encryption.?(?: Click for more info.)?',
  encryptionNotification:
    'Messages to this chat and calls are now secured with end-to-end encryption.?(?: Click for more info.)?',
  missedCall: 'Missed (?:video|voice) call.',
  deletedMessage: '(This message was deleted)|(You deleted this message)',
  attachedContact: 'attached',
  attachedMedia: 'attached',
  attachedDocument: 'attached',
  location: 'location'
});
