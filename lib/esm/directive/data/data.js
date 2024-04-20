import { PopCurrentComponent, PushCurrentComponent, PopCurrentScope, PushCurrentScope, FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, JournalTry, BuildProxyOptions, CreateInplaceProxy, ContextKeys, GetTarget, IsObject } from "@benbraide/inlinejs";
export const DataDirectiveHandler = CreateDirectiveHandlerCallback('data', ({ componentId, component, contextElement, expression }) => {
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = null;
    if (!resolvedComponent || !(elementScope = resolvedComponent.CreateElementScope(contextElement)) || elementScope.IsInitialized()) {
        return;
    }
    let data = GetTarget(EvaluateLater({ componentId, contextElement, expression })()); //No Promise<> support
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
    if (resolvedComponent.GetRoot() !== contextElement) { //Add new scope
        const scope = resolvedComponent.CreateScope(contextElement);
        if (!scope) {
            JournalError('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
            return;
        }
        id = scope.GetId();
        (config === null || config === void 0 ? void 0 : config.name) && scope.SetName(config.name);
        PushCurrentScope(resolvedComponent, id);
        elementScope.AddPostAttributesProcessCallback(() => PopCurrentScope(componentId));
        proxy = scope.GetProxy().GetNative();
        parentLocal = CreateInplaceProxy(BuildProxyOptions({
            getter: (prop) => {
                const component = FindComponentById(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                return ((parent && !GetGlobal().IsNothing(parent) && prop) ? parent[prop] : undefined);
            },
            setter: (prop, value) => {
                const component = FindComponentById(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                (parent && !GetGlobal().IsNothing(parent) && prop) && (parent[prop] = value);
                return true;
            },
            lookup: () => true,
        }));
        elementScope.AddUninitCallback(() => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveScope(id); });
    }
    else { //Root scope
        id = componentId;
        (config === null || config === void 0 ? void 0 : config.reactiveState) && resolvedComponent.SetReactiveState(config.reactiveState);
        (config === null || config === void 0 ? void 0 : config.name) && resolvedComponent.SetName(config.name);
        proxy = resolvedComponent.GetRootProxy().GetNative();
        parentLocal = null;
    }
    elementScope.SetLocal('$parent', parentLocal);
    elementScope.SetLocal('$ancestor', (index = 0) => {
        const component = FindComponentById(componentId), ancestor = component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement, (index || 0));
        return (ancestor ? component.FindElementLocalValue(ancestor, key, true) : undefined);
    });
    (config === null || config === void 0 ? void 0 : config.name) && elementScope.SetLocal('$name', config.name);
    elementScope.SetLocal('$id', id);
    elementScope.SetLocal('$root', contextElement);
    elementScope.SetLocal(key, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => (prop ? proxy[prop] : undefined),
        setter: (prop, value) => {
            prop && (proxy[prop] = value);
            return true;
        },
        lookup: () => true,
    })));
    const target = GetTarget(proxy);
    Object.entries(data).forEach(([key, value]) => (target[key] = value));
    if (config === null || config === void 0 ? void 0 : config.init) { //Evaluate init callback
        const { context } = resolvedComponent.GetBackend();
        context.Push(ContextKeys.self, contextElement);
        PushCurrentComponent(componentId);
        JournalTry(() => config.init.call(proxy), 'DataDirectiveHandler.Init', contextElement);
        PopCurrentComponent();
        context.Pop(ContextKeys.self);
    }
    (config === null || config === void 0 ? void 0 : config.uninit) && elementScope.AddUninitCallback(() => {
        const component = FindComponentById(componentId);
        if (!component) {
            return;
        }
        const { context } = component.GetBackend(), proxy = component.GetRootProxy().GetNative();
        context.Push(ContextKeys.self, contextElement);
        PushCurrentComponent(componentId);
        JournalTry(() => config.uninit.call(proxy), 'DataDirectiveHandler.Uninit', contextElement);
        PopCurrentComponent();
        context.Pop(ContextKeys.self);
    });
});
export function DataDirectiveHandlerCompact() {
    AddDirectiveHandler(DataDirectiveHandler);
}
