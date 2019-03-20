declare interface NodeRequire {
  context(dir: string, includeSubdirs: boolean, filter: RegExp): any;
}

declare var require: NodeRequire;
