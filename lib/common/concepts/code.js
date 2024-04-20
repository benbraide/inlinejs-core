"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeConcept = void 0;
class CodeConcept {
    constructor() {
        this.blocks_ = {};
    }
    AddBlock(name, content) {
        this.blocks_[name] = content;
    }
    RemoveBlock(name) {
        delete this.blocks_[name];
    }
    FindBlock(name) {
        return (this.blocks_.hasOwnProperty(name) ? this.blocks_[name] : '');
    }
}
exports.CodeConcept = CodeConcept;
