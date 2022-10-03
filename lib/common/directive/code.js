"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeDirectiveHandlerCompact = exports.CodeDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.CodeDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('code', ({ componentId, contextElement, expression, argKey }) => {
    var _a;
    let content = (contextElement.textContent || '').trim();
    contextElement.textContent && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(expression, content));
    (argKey === 'execute') && (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression: content, disableFunctionCall: true })();
});
function CodeDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.CodeDirectiveHandler);
}
exports.CodeDirectiveHandlerCompact = CodeDirectiveHandlerCompact;
