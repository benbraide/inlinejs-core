"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticDirectiveHandlerCompact = exports.StaticDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StaticDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('static', ({ componentId, contextElement, expression }) => {
    (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })();
});
function StaticDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.StaticDirectiveHandler);
}
exports.StaticDirectiveHandlerCompact = StaticDirectiveHandlerCompact;
