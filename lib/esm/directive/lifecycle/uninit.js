import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater } from "@benbraide/inlinejs";
export const UninitDirectiveHandler = CreateDirectiveHandlerCallback('uninit', ({ componentId, component, contextElement, expression }) => {
    var _a, _b;
    const evaluate = EvaluateLater({ componentId, contextElement, expression });
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => evaluate());
});
export function UninitDirectiveHandlerCompact() {
    AddDirectiveHandler(UninitDirectiveHandler);
}
