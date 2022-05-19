"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeMagicHandlerCompact = exports.NativeMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.NativeMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('ancestor', () => inlinejs_1.GetTarget);
function NativeMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.NativeMagicHandler);
}
exports.NativeMagicHandlerCompact = NativeMagicHandlerCompact;
