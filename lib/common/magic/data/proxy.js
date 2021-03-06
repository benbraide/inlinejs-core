"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMagicHandlerCompact = exports.ProxyMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ProxyMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('proxy', ({ componentId, component }) => {
    var _a;
    return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative();
});
function ProxyMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ProxyMagicHandler);
}
exports.ProxyMagicHandlerCompact = ProxyMagicHandlerCompact;
