"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMagicHandlerCompact = exports.ProxiedMagicHandler = exports.ProxyMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ProxyMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('proxy', ({ componentId, component }) => {
    var _a;
    return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative();
});
exports.ProxiedMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('proxied', ({ componentId, component }) => {
    return (target) => {
        var _a, _b;
        if (target instanceof HTMLElement) {
            return (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(target)) === null || _b === void 0 ? void 0 : _b.GetProxy().GetNative();
        }
        if ('GetComponentId' in target && 'GetId' in target) {
            return target.GetProxy().GetNative();
        }
        if ('GetId' in target) {
            return target.GetRootProxy().GetNative();
        }
        return (target ? target.GetNative() : null);
    };
});
function ProxyMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ProxyMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.ProxiedMagicHandler);
}
exports.ProxyMagicHandlerCompact = ProxyMagicHandlerCompact;
