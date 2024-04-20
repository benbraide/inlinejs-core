"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownDirectiveHandlerCompact = exports.NextNonIdleDirectiveHandler = exports.NextIdleDirectiveHandler = exports.NextTickDirectiveHandler = exports.CreateCooldownHandlerCallback = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function CreateCooldownHandlerCallback(name, binder) {
    return (0, inlinejs_1.CreateDirectiveHandlerCallback)(name, ({ componentId, contextElement, expression }) => {
        const storedProxyHandler = (0, inlinejs_1.StoreProxyHandler)(componentId);
        const evaluateLater = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: false });
        const handler = () => {
            binder(componentId, handler);
            storedProxyHandler(() => evaluateLater());
        };
        binder(componentId, handler);
    });
}
exports.CreateCooldownHandlerCallback = CreateCooldownHandlerCallback;
exports.NextTickDirectiveHandler = CreateCooldownHandlerCallback('next.tick', (componentId, handler) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(handler); });
exports.NextIdleDirectiveHandler = CreateCooldownHandlerCallback('next.idle', (componentId, handler) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextIdleHandler(handler); });
exports.NextNonIdleDirectiveHandler = CreateCooldownHandlerCallback('next.non.idle', (componentId, handler) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextNonIdleHandler(handler); });
function CooldownDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextTickDirectiveHandler);
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextIdleDirectiveHandler);
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextNonIdleDirectiveHandler);
}
exports.CooldownDirectiveHandlerCompact = CooldownDirectiveHandlerCompact;
