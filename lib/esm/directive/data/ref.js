import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";
export const RefDirectiveHandler = CreateDirectiveHandlerCallback('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    if (argKey === 'evaluate') {
        EvaluateLater({ componentId, contextElement, expression })(data => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.AddRefElement(ToString(data), contextElement); });
    }
    else { //Raw expression
        component === null || component === void 0 ? void 0 : component.AddRefElement(expression, contextElement);
    }
});
export function RefDirectiveHandlerCompact() {
    AddDirectiveHandler(RefDirectiveHandler);
}
