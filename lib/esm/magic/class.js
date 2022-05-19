import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";
export const ClassMagicHandler = CreateMagicHandlerCallback('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = InitJITProxy('class', (component || FindComponentById(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let methods = {
        add: (...values) => contextElement.classList.add(...values),
        remove: (...values) => contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value))),
        toggle: (...values) => values.map(value => contextElement.classList.toggle(value)),
        set: (...values) => (contextElement.className = values.join(' ')),
        contains: (...values) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    return (elementKey ? (scope[elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});
export function ClassMagicHandlerCompact() {
    AddMagicHandler(ClassMagicHandler);
}
