import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy, InitJITProxy } from "@benbraide/inlinejs";
export const StyleMagicHandler = CreateMagicHandlerCallback('style', ({ componentId, component, contextElement }) => {
    const [elementKey, proxy, scope] = InitJITProxy('style', (component || FindComponentById(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    const methods = {
        unset(...keys) {
            keys.forEach(key => (key in contextElement.style) && (contextElement.style[key] = ''));
            return this;
        },
        set(key, value) {
            (key in contextElement.style) && ((value === undefined) ? this.unset(key) : contextElement.style[key] = (value || ''));
            return this;
        },
        toggle(predicate, key, tValue, fValue = undefined) {
            (key in contextElement.style) && this.set(key, (predicate ? tValue : fValue));
            return this;
        },
        get(key) {
            return (Array.isArray(key) ? key.map(k => this.get(k)) : (key in contextElement.style ? contextElement.style[key] : null));
        },
    };
    return (elementKey ? (scope[elementKey] = CreateReadonlyProxy(methods)) : CreateReadonlyProxy(methods));
});
export function StyleMagicHandlerCompact() {
    AddMagicHandler(StyleMagicHandler);
}
