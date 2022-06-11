import {
    FindComponentById,
    AddMagicHandler,
    CreateMagicHandlerCallback,
    IMagicHandlerParams,
    ContextKeys,
    JournalTry,
    PushCurrentComponent,
    PopCurrentComponent
} from "@benbraide/inlinejs";

export function AddNextTickHandler({ componentId, contextElement }: IMagicHandlerParams, callback: (scope: any) => void){
    let contexts = {}, { context } = (FindComponentById(componentId)?.GetBackend() || {});
    context?.GetRecordKeys().forEach(key => (contexts[key] = context?.Peek(key)));
    
    FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => {
        let component = FindComponentById(componentId), { context = null, changes = null } = (component?.GetBackend() || {});

        context?.Push(ContextKeys.self, contextElement);
        changes?.ResetLastAccessContext();

        PushCurrentComponent(componentId);
        Object.entries(contexts || {}).forEach(([key, value]) => context?.Push(key, value));
        
        JournalTry(() => callback.bind(contextElement)(component?.GetRootProxy().GetNative()), 'NextTickMagicHandler.Call', contextElement);

        Object.entries(contexts || {}).forEach(([key, value]) => context?.Pop(key, value));
        PopCurrentComponent();
        context?.Pop(ContextKeys.self);
    });
}

export const NextTickMagicHandler = CreateMagicHandlerCallback('nextTick', (params) => {
    return AddNextTickHandler.bind(null, params);
});

export const NextCycleMagicHandler = CreateMagicHandlerCallback('nextCycle', (params) => {
    return (callback: (scope: any) => void) => AddNextTickHandler(params, () => AddNextTickHandler(params, callback));
});

export function NextTickMagicHandlerCompact(){
    AddMagicHandler(NextTickMagicHandler);
    AddMagicHandler(NextCycleMagicHandler);
}
