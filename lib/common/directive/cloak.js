"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloakDirectiveHandlerCompact = exports.CloakDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.CloakDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('cloak', () => { });
function CloakDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.CloakDirectiveHandler);
}
exports.CloakDirectiveHandlerCompact = CloakDirectiveHandlerCompact;
