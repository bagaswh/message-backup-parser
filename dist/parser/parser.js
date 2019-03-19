(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Parser {
        constructor(source) {
            this.source = source;
            this.splitSource = source.split(/\r\n|\n/);
            this.fileInfo = this._getFileInfo();
        }
        _getFileInfo() {
            let fileInfo = { appType: null, osType: null, lang: null };
            return fileInfo;
        }
    }
    exports.default = Parser;
});
