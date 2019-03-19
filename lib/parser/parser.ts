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

    return fileInfo;
  }
}
