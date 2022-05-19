"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UninitDirectiveHandlerCompact = exports.UninitDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.UninitDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('uninit', ({ componentId, component, contextElement, expression }) => {
    var _a, _b;
    let evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression });
    (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => evaluate());
});
function UninitDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.UninitDirectiveHandler);
}
exports.UninitDirectiveHandlerCompact = UninitDirectiveHandlerCompact;
