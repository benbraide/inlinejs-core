import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
export const StoreMagicHandler = CreateMagicHandlerCallback('store', ({ componentId, contextElement }) => {
    return (value, useLocal = false) => {
        return GetGlobal().StoreObject({
            object: value,
            componentId: (useLocal ? componentId : undefined),
            contextElement: (useLocal ? contextElement : undefined),
        });
    };
});
export function StoreMagicHandlerCompact() {
    AddMagicHandler(StoreMagicHandler);
}
