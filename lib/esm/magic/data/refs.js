import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";
export const RefsMagicHandler = CreateMagicHandlerCallback('refs', ({ componentId, component }) => {
    const resolvedComponent = (component || FindComponentById(componentId));
    return (resolvedComponent ? CreateReadonlyProxy(resolvedComponent.GetRefElements()) : null);
});
export function RefsMagicHandlerCompact() {
    AddMagicHandler(RefsMagicHandler);
}
