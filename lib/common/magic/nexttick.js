"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextTickMagicHandlerCompact = exports.NextCycleMagicHandler = exports.NextTickMagicHandler = exports.AddNextTickHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function AddNextTickHandler({ componentId, contextElement }, callback) {
    var _a, _b;
    const contexts = {}, { context } = (((_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend()) || {});
    context === null || context === void 0 ? void 0 : context.GetRecordKeys().forEach(key => (contexts[key] = context === null || context === void 0 ? void 0 : context.Peek(key)));
    (_b = (0, inlinejs_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddNextTickHandler(() => {
        const component = (0, inlinejs_1.FindComponentById)(componentId), { context = null, changes = null } = ((component === null || component === void 0 ? void 0 : component.GetBackend()) || {});
        context === null || context === void 0 ? void 0 : context.Push(inlinejs_1.ContextKeys.self, contextElement);
        changes === null || changes === void 0 ? void 0 : changes.ResetLastAccessContext();
        (0, inlinejs_1.PushCurrentComponent)(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Push(key, value));
        (0, inlinejs_1.JournalTry)(() => callback.bind(contextElement)(component === null || component === void 0 ? void 0 : component.GetRootProxy().GetNative()), 'NextTickMagicHandler.Call', contextElement);
        Object.entries(contexts || {}).forEach(([key, value]) => context === null || context === void 0 ? void 0 : context.Pop(key, value));
        (0, inlinejs_1.PopCurrentComponent)();
        context === null || context === void 0 ? void 0 : context.Pop(inlinejs_1.ContextKeys.self);
    });
}
exports.AddNextTickHandler = AddNextTickHandler;
exports.NextTickMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('nextTick', (params) => {
    return AddNextTickHandler.bind(null, params);
});
exports.NextCycleMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('nextCycle', (params) => {
    return (callback) => AddNextTickHandler(params, () => AddNextTickHandler(params, callback));
});
function NextTickMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.NextTickMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.NextCycleMagicHandler);
}
exports.NextTickMagicHandlerCompact = NextTickMagicHandlerCompact;
