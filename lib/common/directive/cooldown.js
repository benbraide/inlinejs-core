"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CooldownDirectiveHandlerCompact = exports.NextNonIdleDirectiveHandler = exports.NextIdleDirectiveHandler = exports.NextTickDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
var CooldownType;
(function (CooldownType) {
    CooldownType[CooldownType["tick"] = 0] = "tick";
    CooldownType[CooldownType["idle"] = 1] = "idle";
    CooldownType[CooldownType["nonIdle"] = 2] = "nonIdle";
})(CooldownType || (CooldownType = {}));
function CreateCooldownHandlerCallback(name, type) {
    return (0, inlinejs_1.CreateDirectiveHandlerCallback)(name, ({ componentId, contextElement, expression }) => {
        const evaluateLater = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: false });
        let binder, handler = () => {
            binder();
            evaluateLater();
        };
        if (type === CooldownType.idle) {
            binder = () => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextIdleHandler(handler); };
        }
        else if (type === CooldownType.nonIdle) {
            binder = () => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextNonIdleHandler(handler); };
        }
        else {
            binder = () => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(handler); };
        }
        binder();
    });
}
exports.NextTickDirectiveHandler = CreateCooldownHandlerCallback('next-tick', CooldownType.tick);
exports.NextIdleDirectiveHandler = CreateCooldownHandlerCallback('next-idle', CooldownType.idle);
exports.NextNonIdleDirectiveHandler = CreateCooldownHandlerCallback('next-non-idle', CooldownType.nonIdle);
function CooldownDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextTickDirectiveHandler);
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextIdleDirectiveHandler);
    (0, inlinejs_1.AddDirectiveHandler)(exports.NextNonIdleDirectiveHandler);
}
exports.CooldownDirectiveHandlerCompact = CooldownDirectiveHandlerCompact;
