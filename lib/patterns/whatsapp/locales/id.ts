import { LocaleWhatsApp } from './locale-whatsapp';
import { LocalesStore } from '../../../store/store-locales';

LocalesStore.defineLocale<LocaleWhatsApp>('whatsapp', 'id', {
  firstLineSignature:
    'Pesan yang dikirim ke chat ini dan panggilan kini diamankan dengan enkripsi end-to-end.(?: Ketuk untuk info selengkapnya.)?',
  encryptionNotification:
    'Pesan yang dikirim ke chat ini dan panggilan kini diamankan dengan enkripsi end-to-end.(?: Ketuk untuk info selengkapnya.)?',
  missedCall: 'Missed (?:video|voice) call',
  deletedMessage: '(Pesan ini telah dihapus)|(Anda telah menghapus pesan ini)',
  attachedContact: '\\(?(?:file ?)?terlampir\\)?',
  attachedMedia: '\\(?(?:file ?)?terlampir\\)?',
  attachedDocument: '\\(?(?:file ?)?terlampir\\)?',
  location: 'lokasi'
});
