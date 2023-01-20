"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassMagicHandlerCompact = exports.ClassMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ClassMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('class', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, inlinejs_1.InitJITProxy)('class', (component || (0, inlinejs_1.FindComponentById)(componentId)), contextElement);
    if (proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    let methods = {
        add(...values) {
            contextElement.classList.add(...values);
            return this;
        },
        remove(...values) {
            contextElement.classList.remove(...values.filter(value => contextElement.classList.contains(value)));
            return this;
        },
        toggle(...values) {
            values.map(value => contextElement.classList.toggle(value));
            return this;
        },
        toggleOn(state, ...values) {
            return (state ? this.add(...values) : this.remove(...values));
        },
        set(...values) {
            contextElement.className = values.join(' ');
            return this;
        },
        get value() {
            return contextElement.className;
        },
        contains: (...values) => (values.findIndex(value => !contextElement.classList.contains(value)) == -1),
    };
    return (elementKey ? (scope[elementKey] = (0, inlinejs_1.CreateReadonlyProxy)(methods)) : (0, inlinejs_1.CreateReadonlyProxy)(methods));
});
function ClassMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ClassMagicHandler);
}
exports.ClassMagicHandlerCompact = ClassMagicHandlerCompact;
