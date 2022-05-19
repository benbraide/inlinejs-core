"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentDirectiveHandlerCompact = exports.ComponentDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ComponentDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('component', ({ componentId, component, contextElement, expression, argKey }) => {
    let updateName = (name) => {
        let resolveComponent = (component || (0, inlinejs_1.FindComponentById)(componentId)), elementScope = resolveComponent === null || resolveComponent === void 0 ? void 0 : resolveComponent.FindElementScope(resolveComponent.GetRoot());
        if (!resolveComponent) {
            return;
        }
        resolveComponent.SetName(name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$name', name);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$componentName', name);
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
