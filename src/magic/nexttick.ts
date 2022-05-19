import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const NextTickMagicHandler = CreateMagicHandlerCallback('nextTick', ({ componentId }) => {
    return (callback: () => void) => FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(callback);
});

export function NextTickMagicHandlerCompact(){
    AddMagicHandler(NextTickMagicHandler);
}
