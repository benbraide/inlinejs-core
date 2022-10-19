import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, IScope, IComponent, IProxy } from "@benbraide/inlinejs";

export const ProxyMagicHandler = CreateMagicHandlerCallback('proxy', ({ componentId, component }) => {
    return (component || FindComponentById(componentId))?.GetRootProxy().GetNative();
});

export const ProxiedMagicHandler = CreateMagicHandlerCallback('proxied', ({ componentId, component }) => {
    return (target: HTMLElement | IScope | IComponent | IProxy) => {
        if (target instanceof HTMLElement){
            return (component || FindComponentById(componentId))?.InferScopeFrom(target)?.GetProxy().GetNative();
        }
        
        if ('GetComponentId' in target && 'GetId' in target){
            return target.GetProxy().GetNative();
        }
        
        if ('GetId' in target){
            return target.GetRootProxy().GetNative();
        }
        
        return (target ? target.GetNative() : null);
    };
});

export function ProxyMagicHandlerCompact(){
    AddMagicHandler(ProxyMagicHandler);
    AddMagicHandler(ProxiedMagicHandler);
}
