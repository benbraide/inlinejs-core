import { AddMagicHandler, CreateMagicHandlerCallback, FindComponentById, GetGlobal, JournalTry } from "@benbraide/inlinejs";
export const WrapMagicHandler = CreateMagicHandlerCallback('wrap', ({ componentId, component, contextElement }) => {
    return (func) => {
        var _a;
        const scope = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.InferScopeFrom(contextElement);
        if (!scope) {
            return func;
        }
        return (...args) => {
            GetGlobal().PushScopeContext(scope);
            const result = JournalTry(() => func(...args), 'WrapMagicHandler.Call', contextElement);
            GetGlobal().PopScopeContext();
            return result;
        };
    };
});
export function WrapMagicHandlerCompact() {
    AddMagicHandler(WrapMagicHandler);
}
