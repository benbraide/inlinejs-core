"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeMagicHandlerCompact = exports.CodeMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.CodeMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('code', ({ componentId, contextElement }) => {
    return (name, execute = true, callback) => {
        var _a;
        const expression = (((_a = (0, inlinejs_1.GetGlobal)().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.FindBlock(name)) || '');
        return (execute ? (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })(callback) : expression);
    };
});
function CodeMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.CodeMagicHandler);
}
exports.CodeMagicHandlerCompact = CodeMagicHandlerCompact;
