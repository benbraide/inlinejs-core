import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";
export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b;
    if ((_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized()) {
        return;
    }
    const updateName = (name) => {
        var _a;
        const resolvedComponent = FindComponentById(componentId);
        if (resolvedComponent && resolvedComponent.GetRoot() === contextElement) {
            resolvedComponent.SetName(name);
            (_a = resolvedComponent.FindElementScope(contextElement)) === null || _a === void 0 ? void 0 : _a.SetLocal('$name', name);
        }
    };
    if (argKey === 'evaluate') {
        EvaluateLater({ componentId, contextElement, expression })(data => updateName(ToString(data)));
    }
    else { //Raw expression
        updateName(expression);
    }
});
export function ComponentDirectiveHandlerCompact() {
    AddDirectiveHandler(ComponentDirectiveHandler);
}
