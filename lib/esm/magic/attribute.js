import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";
export const AttributeMagicHandler = CreateMagicHandlerCallback('attribute', ({ componentId, component, contextElement }) => {
    const [elementKey, proxy, scope] = InitJITProxy('attribute', (component || FindComponentById(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    const methods = {
        unset(...keys) {
            keys.forEach(key => (contextElement.hasAttribute(key) && contextElement.removeAttribute(key)));
            return this;
        },
        set(key, value) {
            (value === undefined) ? this.unset(key) : contextElement.setAttribute(key, value);
            return this;
        },
        toggle(predicate, key, tValue, fValue = undefined) {
            this.set(key, (predicate ? tValue : fValue));
            return this;
        },
        get(key) {
            return (Array.isArray(key) ? key.map(k => this.get(k)) : (contextElement.hasAttribute(key) ? contextElement.getAttribute(key) : null));
        },
        contains: (...keys) => (keys.findIndex(key => !contextElement.hasAttribute(key)) == -1),
    };
    return (elementKey ? (scope[elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});
export function AttributeMagicHandlerCompact() {
    AddMagicHandler(AttributeMagicHandler);
}
