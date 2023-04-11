"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSMagicHandlerCompact = exports.InlineJSRandomMagicHandler = exports.InlineJSVersionMagicHandler = exports.InlineJSValuesMagicHandler = exports.InlineJSUtilitiesMagicHandler = exports.InlineJSGlobalMagicHandler = exports.InlineJSMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.InlineJSMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('inlinejs', () => (globalThis['InlineJS'] || null));
exports.InlineJSGlobalMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('global', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['global']) || null));
exports.InlineJSUtilitiesMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('utilities', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['utilities']) || null));
exports.InlineJSValuesMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('values', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['values']) || null));
exports.InlineJSVersionMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('version', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['version']) || null));
exports.InlineJSRandomMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('randstr', () => {
    return (length = 9) => (0, inlinejs_1.RandomString)(length);
});
function InlineJSMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSGlobalMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSUtilitiesMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSValuesMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSVersionMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSRandomMagicHandler);
}
exports.InlineJSMagicHandlerCompact = InlineJSMagicHandlerCompact;
