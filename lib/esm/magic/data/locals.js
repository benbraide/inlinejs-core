import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const LocalsMagicHandler = CreateMagicHandlerCallback('locals', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetLocals();
});
export const GetLocalMagicHandler = CreateMagicHandlerCallback('getLocal', ({ componentId, contextElement }) => {
    return (name) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementLocalValue(contextElement, name, true); };
});
export function LocalsMagicHandlerCompact() {
    AddMagicHandler(LocalsMagicHandler);
    AddMagicHandler(GetLocalMagicHandler);
}
