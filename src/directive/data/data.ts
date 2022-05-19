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
    IsObject
} from "@benbraide/inlinejs";

interface IDataConfigDetails{
    reactiveState?: ReactiveStateType;
    name?: string;
    locals?: Record<string, any>;
    init?: () => void;
    uninit?: () => void;
    post?: () => void;
}

export const DataDirectiveHandler = CreateDirectiveHandlerCallback('data', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        let component = FindComponentById(componentId), elementScope = component?.FindElementScope(contextElement);
        if (!component || !elementScope){
            return;
        }
        
        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});

        let config: IDataConfigDetails | null = null;
        if ('$config' in data){
            config = data['$config'];
            delete data['$config'];
        }

        if (IsObject(config?.locals)){
            Object.entries(config!.locals!).forEach(([key, value]) => elementScope!.SetLocal(key, value));
        }
        
        let proxy = component.GetRootProxy().GetNative(), proxyTarget = GetTarget(proxy), target: Record<string, any>, key = `$${ContextKeys.scope}`;
        if (component.GetRoot() !== contextElement){//Add new scope
            let scope = component.CreateScope(contextElement);
            if (!scope){
                JournalError('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
                return;
            }

            let scopeId = scope.GetId();
            if (config?.name){
                scope.SetName(config.name);
            }

            PushCurrentScope(component, scopeId);
            elementScope.AddPostProcessCallback(() => PopCurrentScope(componentId));
            
            target = {};
            proxy[scopeId] = target;//FindComponentById(componentId)?.FindScopeById(scopeId)?.GetName()

            let local = CreateInplaceProxy(BuildProxyOptions({
                getter: (prop) => {
                    let scope = FindComponentById(componentId)?.GetRootProxy().GetNative()[scopeId];
                    return ((scope && prop) ? scope[prop] : undefined);
                },
                setter: (prop, value) => {
                    let scope = FindComponentById(componentId)?.GetRootProxy().GetNative()[scopeId];
                    return ((scope && prop) ? (scope[prop] = value) : true);
                },
                lookup: () => true,
            }));

            let parentLocal = CreateInplaceProxy(BuildProxyOptions({
                getter: (prop) => {
                    let component = FindComponentById(componentId), parent = component?.FindElementLocalValue((component?.FindAncestor(contextElement) || ''), key, true);
                    return ((parent && !GetGlobal().IsNothing(parent) && prop) ? parent[prop] : undefined);
                },
                setter: (prop, value) => {
                    let component = FindComponentById(componentId), parent = component?.FindElementLocalValue((component?.FindAncestor(contextElement) || ''), key, true);
                    return ((parent && !GetGlobal().IsNothing(parent) && prop) ? (parent[prop] = value) : true);
                },
                lookup: () => true,
            }));

            elementScope.SetLocal(key, local);
            elementScope.SetLocal('$parent', parentLocal);
            config?.name && elementScope.SetLocal('$name', config.name);
            elementScope.AddUninitCallback(() => FindComponentById(componentId)?.RemoveScope(scopeId));
        }
        else{//Root scope
            target = proxyTarget;
            elementScope.SetLocal('$parent', null);
            elementScope.SetLocal('$name', (config?.name || ''));
            elementScope.SetLocal('$componentName', (config?.name || ''));
            elementScope.SetLocal(key, CreateInplaceProxy(BuildProxyOptions({
                getter: (prop) => (prop ? proxy[prop] : undefined),
                setter: (prop, value) => {
                    return (prop ? (proxy[prop] = value) : true);
                },
                lookup: () => true,
            })));
            
            if (config?.reactiveState){
                component.SetReactiveState(config.reactiveState);
            }

            if (config?.name){
                component.SetName(config.name);
            }
        }

        Object.entries(data).forEach(([key, value]) => (target[key] = value));
        if (config?.init){//Evaluate init callback
            let { context } = component.GetBackend();
            
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
});

export function DataDirectiveHandlerCompact(){
    AddDirectiveHandler(DataDirectiveHandler);
}