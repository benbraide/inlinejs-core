"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefsMagicHandlerCompact = exports.RefsMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.RefsMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('refs', ({ componentId, component, contextElement }) => {
    let [elementKey, proxy, scope] = (0, inlinejs_1.InitJITProxy)('refs', (component || (0, inlinejs_1.FindComponentById)(componentId)), contextElement);
    if (!elementKey || proxy) { //Invalid context element OR proxy already exists
        return proxy;
    }
    return (scope[elementKey] = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({
        getter: name => { var _a; return (name && ((_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindRefElement(name))); },
        lookup: () => true,
    })));
});
function RefsMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.RefsMagicHandler);
}
exports.RefsMagicHandlerCompact = RefsMagicHandlerCompact;
