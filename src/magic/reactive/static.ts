import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const StaticMagicHandler = CreateMagicHandlerCallback('static', ({ componentId }) => {
    return (value: any) => {
        FindComponentById(componentId)?.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        return value;
    }
}, ({ componentId, component }) => (component || FindComponentById(componentId))?.GetBackend().changes.PushGetAccessStorageSnapshot());

export function StaticMagicHandlerCompact(){
    AddMagicHandler(StaticMagicHandler);
}
