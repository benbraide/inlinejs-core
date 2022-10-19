import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const ProxyMagicHandler = CreateMagicHandlerCallback('proxy', ({ componentId, component }) => {
    var _a;
    return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative();
});
export const ProxiedMagicHandler = CreateMagicHandlerCallback('proxied', ({ componentId, component }) => {
    return (target) => {
        var _a, _b;
        if (target instanceof HTMLElement) {
            return (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(target)) === null || _b === void 0 ? void 0 : _b.GetProxy().GetNative();
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
export function ProxyMagicHandlerCompact() {
    AddMagicHandler(ProxyMagicHandler);
    AddMagicHandler(ProxiedMagicHandler);
}
