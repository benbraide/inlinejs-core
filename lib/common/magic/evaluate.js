"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateMagicHandlerCompact = exports.EvaluateMagicHandler = exports.FunctionMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.FunctionMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('func', ({ componentId, contextElement }) => {
    return (expression) => (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
});
exports.EvaluateMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('eval', ({ componentId, contextElement }) => {
    return (expression, callback) => (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })(callback);
});
function EvaluateMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.FunctionMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.EvaluateMagicHandler);
}
exports.EvaluateMagicHandlerCompact = EvaluateMagicHandlerCompact;
