import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const LocalsMagicHandler = CreateMagicHandlerCallback('locals', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.GetLocals();
});

export const GetLocalMagicHandler = CreateMagicHandlerCallback('getLocal', ({ componentId, contextElement }) => {
    return (name: string) => FindComponentById(componentId)?.FindElementLocalValue(contextElement, name, true);
});

export function LocalsMagicHandlerCompact(){
    AddMagicHandler(LocalsMagicHandler);
    AddMagicHandler(GetLocalMagicHandler);
}
