"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfDirectiveHandlerCompact = exports.IfDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const selection_1 = require("./selection");
exports.IfDirectiveHandler = (0, selection_1.CreateSelectionDirectiveHandler)(false);
function IfDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.IfDirectiveHandler);
}
exports.IfDirectiveHandlerCompact = IfDirectiveHandlerCompact;
