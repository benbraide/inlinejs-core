import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const LocalsMagicHandler = CreateMagicHandlerCallback('locals', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.GetLocals();
});

export function LocalsMagicHandlerCompact(){
    AddMagicHandler(LocalsMagicHandler);
}
