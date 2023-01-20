"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeMagicHandlerCompact = exports.AttributeMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.AttributeMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('attribute', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, inlinejs_1.InitJITProxy)('attribute', (component || (0, inlinejs_1.FindComponentById)(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let methods = {
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
    return (elementKey ? (scope[elementKey] = (0, inlinejs_1.CreateReadonlyProxy)(methods)) : (0, inlinejs_1.CreateReadonlyProxy)(methods));
});
function AttributeMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.AttributeMagicHandler);
}
exports.AttributeMagicHandlerCompact = AttributeMagicHandlerCompact;
