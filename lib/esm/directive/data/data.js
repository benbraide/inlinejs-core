import { PopCurrentComponent, PushCurrentComponent, PopCurrentScope, PushCurrentScope, FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, JournalTry, BuildProxyOptions, CreateInplaceProxy, ContextKeys, GetTarget, IsObject } from "@benbraide/inlinejs";
export const DataDirectiveHandler = CreateDirectiveHandlerCallback('data', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        let component = FindComponentById(componentId), elementScope = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement);
        if (!component || !elementScope) {
            return;
        }
        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});
        let config = null;
        if (data.hasOwnProperty('$config')) {
            config = data['$config'];
            delete data['$config'];
        }
        if (IsObject(config === null || config === void 0 ? void 0 : config.locals)) {
            Object.entries(config.locals).forEach(([key, value]) => elementScope.SetLocal(key, value));
        }
        let id, proxy, parentLocal, key = `$${ContextKeys.scope}`;
        if (component.GetRoot() !== contextElement) { //Add new scope
            let scope = component.CreateScope(contextElement);
            if (!scope) {
                JournalError('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
                return;
            }
            id = scope.GetId();
            (config === null || config === void 0 ? void 0 : config.name) && scope.SetName(config.name);
            PushCurrentScope(component, id);
            elementScope.AddPostProcessCallback(() => PopCurrentScope(componentId));
            proxy = scope.GetProxy().GetNative();
            parentLocal = CreateInplaceProxy(BuildProxyOptions({
                getter: (prop) => {
                    let component = FindComponentById(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                    return ((parent && !GetGlobal().IsNothing(parent) && prop) ? parent[prop] : undefined);
                },
                setter: (prop, value) => {
                    let component = FindComponentById(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                    (parent && !GetGlobal().IsNothing(parent) && prop) && (parent[prop] = value);
                    return true;
                },
                lookup: () => true,
            }));
            elementScope.AddUninitCallback(() => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveScope(id); });
        }
        else { //Root scope
            id = componentId;
            (config === null || config === void 0 ? void 0 : config.reactiveState) && component.SetReactiveState(config.reactiveState);
            (config === null || config === void 0 ? void 0 : config.name) && component.SetName(config.name);
            proxy = component.GetRootProxy().GetNative();
            parentLocal = null;
        }
        elementScope.SetLocal('$parent', parentLocal);
        (config === null || config === void 0 ? void 0 : config.name) && elementScope.SetLocal('$name', config.name);
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
        if (config === null || config === void 0 ? void 0 : config.init) { //Evaluate init callback
            let { context } = component.GetBackend();
            context.Push(ContextKeys.self, contextElement);
            PushCurrentComponent(componentId);
            JournalTry(() => config.init.call(proxy), 'DataDirectiveHandler.Init', contextElement);
            PopCurrentComponent();
            context.Pop(ContextKeys.self);
        }
        if (config === null || config === void 0 ? void 0 : config.uninit) {
            elementScope.AddUninitCallback(() => {
                let component = FindComponentById(componentId);
                if (!component) {
                    return;
                }
                let { context } = component.GetBackend(), proxy = component.GetRootProxy().GetNative();
                context.Push(ContextKeys.self, contextElement);
                PushCurrentComponent(componentId);
                JournalTry(() => config.uninit.call(proxy), 'DataDirectiveHandler.Uninit', contextElement);
                PopCurrentComponent();
                context.Pop(ContextKeys.self);
            });
        }
    });
});
export function DataDirectiveHandlerCompact() {
    AddDirectiveHandler(DataDirectiveHandler);
}
