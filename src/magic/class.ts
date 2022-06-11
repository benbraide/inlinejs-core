import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";

export const ClassMagicHandler = CreateMagicHandlerCallback('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('class', (component || FindComponentById(componentId)), contextElement);
    if (proxy){//Invalid context element OR proxy already exists
        return proxy;
    }

    let add = (...values: string[]) => contextElement.classList.add(...values);
    let remove = (...values: string[]) => contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value)));
    
    let methods = { add, remove,
        toggle: (...values: string[]) => values.map(value => contextElement.classList.toggle(value)),
        toggleOn: (state: boolean, ...values: string[]) => (state ? add(...values) : remove(...values)),
        set: (...values: string[]) => (contextElement.className = values.join(' ')),
        contains: (...values: string[]) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    
    return (elementKey ? (scope![elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});

export function ClassMagicHandlerCompact(){
    AddMagicHandler(ClassMagicHandler);
}
