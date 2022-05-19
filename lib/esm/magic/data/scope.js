import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy } from "@benbraide/inlinejs";
export const ScopeMagicHandler = CreateMagicHandlerCallback('scope', ({ componentId, component, contextElement }) => {
    var _a;
    return (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement);
});
export const ScopesMagicHandler = CreateMagicHandlerCallback('scopes', ({ componentId }) => {
    return CreateInplaceProxy(BuildGetterProxyOptions({ getter: prop => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindScopeByName(prop); }, lookup: () => true }));
});
export function ScopeMagicHandlerCompact() {
    AddMagicHandler(ScopeMagicHandler);
    AddMagicHandler(ScopesMagicHandler);
}
