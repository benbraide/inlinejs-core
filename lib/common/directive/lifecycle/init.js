"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDirectiveHandlerCompact = exports.InitDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.InitDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('init', ({ componentId, component, contextElement, expression }) => {
    var _a, _b;
    if (!((_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized())) {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true })();
    }
});
function InitDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.InitDirectiveHandler);
}
exports.InitDirectiveHandlerCompact = InitDirectiveHandlerCompact;
