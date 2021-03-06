import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const UnoptimizedMagicHandler = CreateMagicHandlerCallback('unoptimized', ({ componentId }) => {
    return (value) => {
        var _a;
        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.RestoreOptimizedGetAccessStorage();
        return value;
    };
}, ({ componentId, component }) => { var _a; return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.SwapOptimizedGetAccessStorage(); });
export function UnoptimizedMagicHandlerCompact() {
    AddMagicHandler(UnoptimizedMagicHandler);
}
