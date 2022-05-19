import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback,BuildGetterProxyOptions, CreateInplaceProxy, InitJITProxy } from "@benbraide/inlinejs";

export const RefsMagicHandler = CreateMagicHandlerCallback('refs', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('refs', (component || FindComponentById(componentId)), contextElement);
    if (!elementKey || proxy){//Invalid context element OR proxy already exists
        return proxy;
    }
    
    return (scope![elementKey] = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: name => (name && FindComponentById(componentId)?.FindRefElement(name)),
        lookup: () => true,
    })));
});

export function RefsMagicHandlerCompact(){
    AddMagicHandler(RefsMagicHandler);
}
