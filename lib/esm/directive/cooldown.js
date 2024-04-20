import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById, StoreProxyHandler } from "@benbraide/inlinejs";
export function CreateCooldownHandlerCallback(name, binder) {
    return CreateDirectiveHandlerCallback(name, ({ componentId, contextElement, expression }) => {
        const storedProxyHandler = StoreProxyHandler(componentId);
        const evaluateLater = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: false });
        const handler = () => {
            binder(componentId, handler);
            storedProxyHandler(() => evaluateLater());
        };
        binder(componentId, handler);
    });
}
export const NextTickDirectiveHandler = CreateCooldownHandlerCallback('next.tick', (componentId, handler) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(handler); });
export const NextIdleDirectiveHandler = CreateCooldownHandlerCallback('next.idle', (componentId, handler) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextIdleHandler(handler); });
export const NextNonIdleDirectiveHandler = CreateCooldownHandlerCallback('next.non.idle', (componentId, handler) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextNonIdleHandler(handler); });
export function CooldownDirectiveHandlerCompact() {
    AddDirectiveHandler(NextTickDirectiveHandler);
    AddDirectiveHandler(NextIdleDirectiveHandler);
    AddDirectiveHandler(NextNonIdleDirectiveHandler);
}
