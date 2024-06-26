import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy } from "@benbraide/inlinejs";

export const ScopeMagicHandler = CreateMagicHandlerCallback('scope', ({ componentId, component, contextElement }) => {
    return (component || FindComponentById(componentId))?.InferScopeFrom(contextElement)?.GetProxy().GetNative();
});

export const ScopesMagicHandler = CreateMagicHandlerCallback('scopes', ({ componentId }) => {
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: prop => (FindComponentById(componentId)?.FindScopeByName(prop!) || FindComponentById(componentId)?.FindScopeById(prop!)),
        lookup: () => true,
    }));
});

export function ScopeMagicHandlerCompact(){
    AddMagicHandler(ScopeMagicHandler);
    AddMagicHandler(ScopesMagicHandler);
}
