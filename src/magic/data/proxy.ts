import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const ProxyMagicHandler = CreateMagicHandlerCallback('proxy', ({ componentId, component }) => {
    return (component || FindComponentById(componentId))?.GetRootProxy().GetNative();
});

export function ProxyMagicHandlerCompact(){
    AddMagicHandler(ProxyMagicHandler);
}
