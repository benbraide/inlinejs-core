"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentDirectiveHandlerCompact = exports.ComponentDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ComponentDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('component', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b;
    if ((_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized()) {
        return;
    }
    const updateName = (name) => {
        var _a;
        const resolvedComponent = (0, inlinejs_1.FindComponentById)(componentId);
        if (resolvedComponent && resolvedComponent.GetRoot() === contextElement) {
            resolvedComponent.SetName(name);
            (_a = resolvedComponent.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.SetLocal('$name', name);
        }
    };
    if (argKey === 'evaluate') {
        (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })(data => updateName((0, inlinejs_1.ToString)(data)));
    }
    else { //Raw expression
        updateName(expression);
    }
});
function ComponentDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.ComponentDirectiveHandler);
}
exports.ComponentDirectiveHandlerCompact = ComponentDirectiveHandlerCompact;
