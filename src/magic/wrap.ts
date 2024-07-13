import { AddMagicHandler, CreateMagicHandlerCallback, FindComponentById, GetGlobal, JournalTry } from "@benbraide/inlinejs";

export const WrapMagicHandler = CreateMagicHandlerCallback('wrap', ({ componentId, component, contextElement }) => {
    return (func: Function) => {
        const scope = (component || FindComponentById(componentId))?.InferScopeFrom(contextElement);
        if (!scope){
            return func;
        }

        return (...args: any[]) => {
            GetGlobal().PushScopeContext(scope);
            const result = JournalTry(() => func(...args), 'WrapMagicHandler.Call', contextElement);
            GetGlobal().PopScopeContext();
            return result;
        };
    };
});

export function WrapMagicHandlerCompact(){
    AddMagicHandler(WrapMagicHandler);
}
