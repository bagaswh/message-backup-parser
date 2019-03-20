import { MinimumLocaleDefinition } from '../../../store/store-locales';
import { Indexer } from '../../../types/types';

export interface LocaleLINE extends MinimumLocaleDefinition, Indexer<string> {
  beginningFile: string;
  dateSaved: string;
}
