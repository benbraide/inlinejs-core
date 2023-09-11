import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetTarget, IsObject } from "@benbraide/inlinejs";
export const LocalsDirectiveHandler = CreateDirectiveHandlerCallback('locals', ({ component, componentId, contextElement, expression }) => {
    var _a, _b;
    if ((_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized()) {
        return;
    }
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        var _a;
        let elementScope = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement);
        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});
        Object.entries(data).forEach(([key, value]) => elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(key, value));
    });
});
export function LocalsDirectiveHandlerCompact() {
    AddDirectiveHandler(LocalsDirectiveHandler);
}
