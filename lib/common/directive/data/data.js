"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDirectiveHandlerCompact = exports.DataDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.DataDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('data', ({ componentId, component, contextElement, expression }) => {
    let resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId)), elementScope = null;
    if (!resolvedComponent || !(elementScope = resolvedComponent.CreateElementScope(contextElement)) || elementScope.IsInitialized()) {
        return;
    }
    let data = (0, inlinejs_1.GetTarget)((0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })()); //No Promise<> support
    data = (((0, inlinejs_1.IsObject)(data) && data) || {});
    let config = null;
    if (data.hasOwnProperty('$config')) {
        config = data['$config'];
        delete data['$config'];
    }
    if ((0, inlinejs_1.IsObject)(config === null || config === void 0 ? void 0 : config.locals)) {
        Object.entries(config.locals).forEach(([key, value]) => elementScope.SetLocal(key, value));
    }
    let id, proxy, parentLocal, key = `$${inlinejs_1.ContextKeys.scope}`;
    if (resolvedComponent.GetRoot() !== contextElement) { //Add new scope
        let scope = resolvedComponent.CreateScope(contextElement);
        if (!scope) {
            (0, inlinejs_1.JournalError)('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
            return;
        }
        id = scope.GetId();
        (config === null || config === void 0 ? void 0 : config.name) && scope.SetName(config.name);
        (0, inlinejs_1.PushCurrentScope)(resolvedComponent, id);
        elementScope.AddPostProcessCallback(() => (0, inlinejs_1.PopCurrentScope)(componentId));
        proxy = scope.GetProxy().GetNative();
        parentLocal = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
            getter: (prop) => {
                let component = (0, inlinejs_1.FindComponentById)(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                return ((parent && !(0, inlinejs_1.GetGlobal)().IsNothing(parent) && prop) ? parent[prop] : undefined);
            },
            setter: (prop, value) => {
                let component = (0, inlinejs_1.FindComponentById)(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                (parent && !(0, inlinejs_1.GetGlobal)().IsNothing(parent) && prop) && (parent[prop] = value);
                return true;
            },
            lookup: () => true,
        }));
        elementScope.AddUninitCallback(() => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveScope(id); });
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
        let component = (0, inlinejs_1.FindComponentById)(componentId), ancestor = component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement, (index || 0));
        return (ancestor ? component.FindElementLocalValue(ancestor, key, true) : undefined);
    });
    (config === null || config === void 0 ? void 0 : config.name) && elementScope.SetLocal('$name', config.name);
    elementScope.SetLocal('$id', id);
    elementScope.SetLocal(key, (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
        getter: (prop) => (prop ? proxy[prop] : undefined),
        setter: (prop, value) => {
            prop && (proxy[prop] = value);
            return true;
        },
        lookup: () => true,
    })));
    let target = (0, inlinejs_1.GetTarget)(proxy);
    Object.entries(data).forEach(([key, value]) => (target[key] = value));
    if (config === null || config === void 0 ? void 0 : config.init) { //Evaluate init callback
        let { context } = resolvedComponent.GetBackend();
        context.Push(inlinejs_1.ContextKeys.self, contextElement);
        (0, inlinejs_1.PushCurrentComponent)(componentId);
        (0, inlinejs_1.JournalTry)(() => config.init.call(proxy), 'DataDirectiveHandler.Init', contextElement);
        (0, inlinejs_1.PopCurrentComponent)();
        context.Pop(inlinejs_1.ContextKeys.self);
    }
    if (config === null || config === void 0 ? void 0 : config.uninit) {
        elementScope.AddUninitCallback(() => {
            let component = (0, inlinejs_1.FindComponentById)(componentId);
            if (!component) {
                return;
            }
            let { context } = component.GetBackend(), proxy = component.GetRootProxy().GetNative();
            context.Push(inlinejs_1.ContextKeys.self, contextElement);
            (0, inlinejs_1.PushCurrentComponent)(componentId);
            (0, inlinejs_1.JournalTry)(() => config.uninit.call(proxy), 'DataDirectiveHandler.Uninit', contextElement);
            (0, inlinejs_1.PopCurrentComponent)();
            context.Pop(inlinejs_1.ContextKeys.self);
        });
    }
});
function DataDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.DataDirectiveHandler);
}
exports.DataDirectiveHandlerCompact = DataDirectiveHandlerCompact;
