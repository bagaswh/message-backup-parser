import { readBackupFile } from './file-reader';
import Parser from './parser/parser';

let file = readBackupFile('examples/wa_android_bege_id/_chat.txt');
export const data = new Parser(file).parse();
