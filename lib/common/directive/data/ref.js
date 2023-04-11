"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefDirectiveHandlerCompact = exports.RefDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.RefDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b, _c;
    if ((_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized()) {
        return;
    }
    if (argKey === 'evaluate') {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })(data => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.AddRefElement((0, inlinejs_1.ToString)(data), contextElement); });
    }
    else { //Raw expression
        (_c = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _c === void 0 ? void 0 : _c.AddRefElement(expression, contextElement);
    }
});
function RefDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.RefDirectiveHandler);
}
exports.RefDirectiveHandlerCompact = RefDirectiveHandlerCompact;
