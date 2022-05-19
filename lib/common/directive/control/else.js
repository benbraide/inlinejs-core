"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElseDirectiveHandlerCompact = exports.ElseDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const selection_1 = require("./selection");
exports.ElseDirectiveHandler = (0, selection_1.CreateSelectionDirectiveHandler)(true);
function ElseDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.ElseDirectiveHandler);
}
exports.ElseDirectiveHandlerCompact = ElseDirectiveHandlerCompact;
