"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeMagicHandlerCompact = exports.ScopesMagicHandler = exports.ScopeMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ScopeMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('scope', ({ componentId, component, contextElement }) => {
    var _a;
    return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement);
});
exports.ScopesMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('scopes', ({ componentId }) => {
    return (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({ getter: prop => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindScopeByName(prop); }, lookup: () => true }));
});
function ScopeMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ScopeMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.ScopesMagicHandler);
}
exports.ScopeMagicHandlerCompact = ScopeMagicHandlerCompact;
