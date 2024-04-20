import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy } from "@benbraide/inlinejs";
export const ScopeMagicHandler = CreateMagicHandlerCallback('scope', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement)) === null || _b === void 0 ? void 0 : _b.GetProxy().GetNative();
});
export const ScopesMagicHandler = CreateMagicHandlerCallback('scopes', ({ componentId }) => {
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: prop => { var _a, _b; return (((_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindScopeByName(prop)) || ((_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.FindScopeById(prop))); },
        lookup: () => true,
    }));
});
export function ScopeMagicHandlerCompact() {
    AddMagicHandler(ScopeMagicHandler);
    AddMagicHandler(ScopesMagicHandler);
}
