// using hash value to map between regex string to regex value, used for caching
// hash value is computed from the regex string itself
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hashCode(str: string) {
  let hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

type BuildOptions = {
  formatSpecifier: string;
  includeStartingBoundary: boolean;
  includeEndBoundary: boolean;
};

export class RegexBuilder {
  private static formatSpecifier = '{{fs}}';
  private static regexFormatSpecifier = /\{\{fs\}\}/g;

  // caching to avoid recreating regexp with RegExp constructor
  private static readonly regexCache: Indexer<RegExp> = {};

  private static _changeFormatSpecifier(formatSpecifier: string) {
    this.formatSpecifier = formatSpecifier;
    this.regexFormatSpecifier = new RegExp(formatSpecifier, 'g');
  }

  public static build(
    str: string,
    opts: BuildOptions = {
      formatSpecifier: this.formatSpecifier,
      includeStartingBoundary: false,
      includeEndBoundary: false
    },
    ...formatParams: string[]
  ) {
    let formatParamsIndex = 0;
    let formattedStr = str.replace(
      this.regexFormatSpecifier,
      (substring: string, ...args: any[]) => {
        return formatParams[formatParamsIndex++];
      }
    );

    if (opts.includeStartingBoundary) {
      formattedStr = '^' + formattedStr;
    }
    if (opts.includeEndBoundary) {
      formattedStr += '$';
    }

    let hash = hashCode(formattedStr);
    if (!this.regexCache[hash]) {
      this.regexCache[hash] = new RegExp(formattedStr);
    }

    return this.regexCache[hash];
  }
}
