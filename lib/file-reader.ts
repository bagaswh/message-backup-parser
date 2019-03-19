import { readFileSync } from 'fs';

export function readBackupFile(path: string) {
  return readFileSync(path, 'utf-8');
}
