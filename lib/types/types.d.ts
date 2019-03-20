export interface Indexer<T> {
  [index: string]: T;
  [index: number]: T;
}
