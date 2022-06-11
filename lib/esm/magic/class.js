import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";
export const ClassMagicHandler = CreateMagicHandlerCallback('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('class', (component || FindComponentById(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let add = (...values) => contextElement.classList.add(...values);
    let remove = (...values) => contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value)));
    let methods = { add, remove,
        toggle: (...values) => values.map(value => contextElement.classList.toggle(value)),
        toggleOn: (state, ...values) => (state ? add(...values) : remove(...values)),
        set: (...values) => (contextElement.className = values.join(' ')),
        contains: (...values) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    return (elementKey ? (scope[elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});
export function ClassMagicHandlerCompact() {
    AddMagicHandler(ClassMagicHandler);
}
