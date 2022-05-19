"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsDirectiveHandlerCompact = exports.LocalsDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.LocalsDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('locals', ({ componentId, contextElement, expression }) => {
    (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
        var _a;
        let elementScope = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        data = (0, inlinejs_1.GetTarget)(data);
        data = (((0, inlinejs_1.IsObject)(data) && data) || {});
        Object.entries(data).forEach(([key, value]) => elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(key, value));
    });
});
function LocalsDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.LocalsDirectiveHandler);
}
exports.LocalsDirectiveHandlerCompact = LocalsDirectiveHandlerCompact;
