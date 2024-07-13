"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WrapMagicHandlerCompact = exports.WrapMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.WrapMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('wrap', ({ componentId, component, contextElement }) => {
    return (func) => {
        var _a;
        const scope = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement);
        if (!scope) {
            return func;
        }
        return (...args) => {
            (0, inlinejs_1.GetGlobal)().PushScopeContext(scope);
            const result = (0, inlinejs_1.JournalTry)(() => func(...args), 'WrapMagicHandler.Call', contextElement);
            (0, inlinejs_1.GetGlobal)().PopScopeContext();
            return result;
        };
    };
});
function WrapMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.WrapMagicHandler);
}
exports.WrapMagicHandlerCompact = WrapMagicHandlerCompact;
