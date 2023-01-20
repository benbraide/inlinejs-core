"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleMagicHandlerCompact = exports.StyleMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StyleMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('style', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, inlinejs_1.InitJITProxy)('style', (component || (0, inlinejs_1.FindComponentById)(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let methods = {
        unset(...keys) {
            keys.forEach(key => (key in contextElement.style) && contextElement.style.removeProperty(key));
            return this;
        },
        set(key, value) {
            (key in contextElement.style) && ((value === undefined) ? this.unset(key) : contextElement.style[key] = value);
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
    return (elementKey ? (scope[elementKey] = (0, inlinejs_1.CreateReadonlyProxy)(methods)) : (0, inlinejs_1.CreateReadonlyProxy)(methods));
});
function StyleMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.StyleMagicHandler);
}
exports.StyleMagicHandlerCompact = StyleMagicHandlerCompact;
