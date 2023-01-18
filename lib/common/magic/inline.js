"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSMagicHandlerCompact = exports.InlineJSMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.InlineJSMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('inlinejs', () => (globalThis['InlineJS'] || null));
function InlineJSMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSMagicHandler);
}
exports.InlineJSMagicHandlerCompact = InlineJSMagicHandlerCompact;
