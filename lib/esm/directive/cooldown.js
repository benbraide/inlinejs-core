import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById } from "@benbraide/inlinejs";
var CooldownType;
(function (CooldownType) {
    CooldownType[CooldownType["tick"] = 0] = "tick";
    CooldownType[CooldownType["idle"] = 1] = "idle";
    CooldownType[CooldownType["nonIdle"] = 2] = "nonIdle";
})(CooldownType || (CooldownType = {}));
function CreateCooldownHandlerCallback(name, type) {
    return CreateDirectiveHandlerCallback(name, ({ componentId, contextElement, expression }) => {
        const evaluateLater = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: false });
        let binder, handler = () => {
            binder();
            evaluateLater();
        };
        if (type === CooldownType.idle) {
            binder = () => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextIdleHandler(handler); };
        }
        else if (type === CooldownType.nonIdle) {
            binder = () => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextNonIdleHandler(handler); };
        }
        else {
            binder = () => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(handler); };
        }
        binder();
    });
}
export const NextTickDirectiveHandler = CreateCooldownHandlerCallback('next-tick', CooldownType.tick);
export const NextIdleDirectiveHandler = CreateCooldownHandlerCallback('next-idle', CooldownType.idle);
export const NextNonIdleDirectiveHandler = CreateCooldownHandlerCallback('next-non-idle', CooldownType.nonIdle);
export function CooldownDirectiveHandlerCompact() {
    AddDirectiveHandler(NextTickDirectiveHandler);
    AddDirectiveHandler(NextIdleDirectiveHandler);
    AddDirectiveHandler(NextNonIdleDirectiveHandler);
}
