import { readBackupFile } from './file-reader';
import Parser from './parser/parser';

let file = readBackupFile('examples/LINE_ios_en.txt');
console.log(new Parser(file).parse());
