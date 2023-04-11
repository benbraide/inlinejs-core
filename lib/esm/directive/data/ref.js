import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";
export const RefDirectiveHandler = CreateDirectiveHandlerCallback('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    var _a, _b, _c;
    if ((_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized()) {
        return;
    }
    if (argKey === 'evaluate') {
        EvaluateLater({ componentId, contextElement, expression })(data => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.AddRefElement(ToString(data), contextElement); });
    }
    else { //Raw expression
        (_c = (component || FindComponentById(componentId))) === null || _c === void 0 ? void 0 : _c.AddRefElement(expression, contextElement);
    }
});
export function RefDirectiveHandlerCompact() {
    AddDirectiveHandler(RefDirectiveHandler);
}
