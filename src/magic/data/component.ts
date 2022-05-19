import { FindComponentById, FindComponentByName, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const ComponentMagicHandler = CreateMagicHandlerCallback('component', () => (name: string) => FindComponentByName(name)?.GetRootProxy().GetNative());

export const ComponentNameMagicHandler = CreateMagicHandlerCallback('name', ({ componentId, component }) => (component || FindComponentById(componentId))?.GetName());

export function ComponentMagicHandlerCompact(){
    AddMagicHandler(ComponentMagicHandler);
    AddMagicHandler(ComponentNameMagicHandler);
}

