import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const StaticMagicHandler = CreateMagicHandlerCallback('static', ({ componentId }) => {
    return (value) => {
        var _a;
        (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        return value;
    };
}, ({ componentId, component }) => { var _a; return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.PushGetAccessStorageSnapshot(); });
export function StaticMagicHandlerCompact() {
    AddMagicHandler(StaticMagicHandler);
}
