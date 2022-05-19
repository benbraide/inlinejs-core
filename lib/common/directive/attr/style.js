"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleDirectiveHandlerCompact = exports.StyleDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StyleDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('style', ({ componentId, contextElement, expression, argKey }) => {
    (0, inlinejs_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => {
            key = (0, inlinejs_1.ToCamelCase)(key, false, '.');
            if (key in contextElement.style) {
                contextElement.style[key] = (0, inlinejs_1.ToString)(value);
            }
        },
    });
});
function StyleDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.StyleDirectiveHandler);
}
exports.StyleDirectiveHandlerCompact = StyleDirectiveHandlerCompact;
