import {
    PopCurrentComponent,
    PushCurrentComponent,
    PopCurrentScope,
    PushCurrentScope,
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    GetGlobal,
    JournalError,
    JournalTry,
    BuildProxyOptions,
    CreateInplaceProxy,
    ReactiveStateType,
    ContextKeys,
    GetTarget,
    IsObject,
    IElementScope
} from "@benbraide/inlinejs";

interface IDataConfigDetails{
    reactiveState?: ReactiveStateType;
    name?: string;
    locals?: Record<string, any>;
    init?: () => void;
    uninit?: () => void;
    post?: () => void;
}

export const DataDirectiveHandler = CreateDirectiveHandlerCallback('data', ({ componentId, component, contextElement, expression }) => {
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope: IElementScope | null | undefined = null;
    if (!resolvedComponent || !(elementScope = resolvedComponent.CreateElementScope(contextElement)) || elementScope.IsInitialized()){
        return;
    }
    
    let data = GetTarget(EvaluateLater({ componentId, contextElement, expression })());//No Promise<> support
    data = ((IsObject(data) && data) || {});

    let config: IDataConfigDetails | null = null;
    if (data.hasOwnProperty('$config')){
        config = data['$config'];
        delete data['$config'];
    }

    if (IsObject(config?.locals)){
        Object.entries(config!.locals!).forEach(([key, value]) => elementScope!.SetLocal(key, value));
    }
    
    let id: string,  proxy: any, parentLocal: object | null, key = `$${ContextKeys.scope}`;
    if (resolvedComponent.GetRoot() !== contextElement){//Add new scope
        let scope = resolvedComponent.CreateScope(contextElement);
        if (!scope){
            JournalError('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
            return;
        }

        id = scope.GetId();
        config?.name && scope.SetName(config.name);

        PushCurrentScope(resolvedComponent, id);
        elementScope.AddPostProcessCallback(() => PopCurrentScope(componentId));
        
        proxy = scope.GetProxy().GetNative();
        parentLocal = CreateInplaceProxy(BuildProxyOptions({
            getter: (prop) => {
                let component = FindComponentById(componentId), parent = component?.FindElementLocalValue((component?.FindAncestor(contextElement) || ''), key, true);
                return ((parent && !GetGlobal().IsNothing(parent) && prop) ? parent[prop] : undefined);
            },
            setter: (prop, value) => {
                let component = FindComponentById(componentId), parent = component?.FindElementLocalValue((component?.FindAncestor(contextElement) || ''), key, true);
                (parent && !GetGlobal().IsNothing(parent) && prop) && (parent[prop] = value);
                return true;
            },
            lookup: () => true,
        }));
        
        elementScope.AddUninitCallback(() => FindComponentById(componentId)?.RemoveScope(id));
    }
    else{//Root scope
        id = componentId;

        config?.reactiveState && resolvedComponent.SetReactiveState(config.reactiveState);
        config?.name && resolvedComponent.SetName(config.name);
        
        proxy = resolvedComponent.GetRootProxy().GetNative();
        parentLocal = null;
    }

    elementScope.SetLocal('$parent', parentLocal);
    elementScope.SetLocal('$ancestor', (index = 0) => {
        let component = FindComponentById(componentId), ancestor = component?.FindAncestor(contextElement, (index || 0));
        return (ancestor ? component!.FindElementLocalValue(ancestor, key, true) : undefined);
    });
    
    config?.name && elementScope.SetLocal('$name', config.name);
    elementScope.SetLocal('$id', id);
    
    elementScope.SetLocal(key, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => (prop ? proxy[prop] : undefined),
        setter: (prop, value) => {
            prop && (proxy[prop] = value);
            return true;
        },
        lookup: () => true,
    })));

    let target = GetTarget(proxy);
    Object.entries(data).forEach(([key, value]) => (target[key] = value));

    if (config?.init){//Evaluate init callback
        let { context } = resolvedComponent.GetBackend();
        
        context.Push(ContextKeys.self, contextElement);
        PushCurrentComponent(componentId);
        
        JournalTry(() => config!.init!.call(proxy), 'DataDirectiveHandler.Init', contextElement);

        PopCurrentComponent();
        context.Pop(ContextKeys.self);
    }

    if (config?.uninit){
        elementScope.AddUninitCallback(() => {
            let component = FindComponentById(componentId);
            if (!component){
                return;
            }

            let { context } = component.GetBackend(), proxy = component.GetRootProxy().GetNative();
        
            context.Push(ContextKeys.self, contextElement);
            PushCurrentComponent(componentId);
            
            JournalTry(() => config!.uninit!.call(proxy), 'DataDirectiveHandler.Uninit', contextElement);

            PopCurrentComponent();
            context.Pop(ContextKeys.self);
        });
    }
});

export function DataDirectiveHandlerCompact(){
    AddDirectiveHandler(DataDirectiveHandler);
}
