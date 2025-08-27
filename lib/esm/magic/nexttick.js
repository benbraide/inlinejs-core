import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, ContextKeys, JournalTry, PushCurrentComponent, PopCurrentComponent } from "@benbraide/inlinejs";
export function AddNextTickHandler({ componentId, contextElement }, callback) {
    var _a, _b;
    const contexts = {}, { context } = (((_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend()) || {});
    context === null || context === void 0 ? void 0 : context.GetRecordKeys().forEach(key => (contexts[key] = context === null || context === void 0 ? void 0 : context.Peek(key)));
    (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddNextTickHandler(() => {
        const component = FindComponentById(componentId), { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
        context === null || context === void 0 ? void 0 : context.Push(ContextKeys.self, contextElement);
        PushCurrentComponent(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Push(key, value));
        JournalTry(() => callback.bind(contextElement)(component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative()), 'NextTickMagicHandler.Call', contextElement);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Pop(key, value));
        PopCurrentComponent();
        context === null || context === void 0 ? void 0 : context.Pop(ContextKeys.self);
    });
}
export const NextTickMagicHandler = CreateMagicHandlerCallback('nextTick', (params) => {
    return AddNextTickHandler.bind(null, params);
});
export const NextCycleMagicHandler = CreateMagicHandlerCallback('nextCycle', (params) => {
    return (callback) => AddNextTickHandler(params, () => AddNextTickHandler(params, callback));
});
export function NextTickMagicHandlerCompact() {
    AddMagicHandler(NextTickMagicHandler);
    AddMagicHandler(NextCycleMagicHandler);
}
