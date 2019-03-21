import { RegexBuilder } from './../regex-builder';
import { PatternsStore } from './../store/store-patterns';
import { LocalesStore } from '../store/store-locales';
import { mapToScanner } from './map-to-scanner';

export type AppType = 'line' | 'whatsapp';
export type OSType = 'ios' | 'android';

export interface FileInfo {
  appType: AppType | null;
  osType: OSType | null;
  lang: string | null;
}

export default class Parser {
  private readonly splitSource: string[];
  private readonly fileInfo: FileInfo;

  constructor(private readonly source: string) {
    this.splitSource = source.split(/\r\n|\n/);
    this.fileInfo = this._getFileInfo();
  }

  private _getFileInfo() {
    let fileInfo: FileInfo = { appType: null, osType: null, lang: null };
    let firstLine = this.splitSource[0];
    let patterns = PatternsStore.getAllPatterns();

    // exhaust check every data
    // linearly search every regex and match for each of them to firstLine string
    for (let appType in patterns) {
      let localesByAppName = LocalesStore.getLocalesByAppName(appType);
      for (let localeLang in localesByAppName) {
        for (let osType in patterns[appType]) {
          let firstLineSignatureRegex = RegexBuilder.build(
            patterns[appType][osType].firstLineSignature,
            undefined,
            LocalesStore.getLocale(appType, localeLang).firstLineSignature
          );
          if (firstLine.match(firstLineSignatureRegex)) {
            fileInfo = { appType: appType as AppType, osType: osType as OSType, lang: localeLang };
            return fileInfo;
          }
        }
      }
    }

    return fileInfo;
  }

  public parse() {
    let Scanner = mapToScanner[this.fileInfo.appType];
    if (Scanner) {
      return new Scanner(this.splitSource, this.fileInfo).scan();
    }

    return null;
  }
}
