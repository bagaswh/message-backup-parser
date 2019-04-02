import { Indexer } from './../../index.d';
import { ScannerWhatsApp } from './../scanner/scanner-whatsapp';
import { ScannerLINE } from './../scanner/scanner-line';

export const mapToScanner: Indexer<any> = {
  line: ScannerLINE,
  whatsapp: ScannerWhatsApp
};
