import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById } from "@benbraide/inlinejs";
export const InitDirectiveHandler = CreateDirectiveHandlerCallback('init', ({ componentId, component, contextElement, expression }) => {
    var _a, _b;
    if (!((_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.CreateElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.IsInitialized())) {
        EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })();
    }
});
export function InitDirectiveHandlerCompact() {
    AddDirectiveHandler(InitDirectiveHandler);
}
