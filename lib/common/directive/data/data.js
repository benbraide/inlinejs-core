"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDirectiveHandlerCompact = exports.DataDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.DataDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('data', ({ componentId, contextElement, expression }) => {
    (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
        let component = (0, inlinejs_1.FindComponentById)(componentId), elementScope = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement);
        if (!component || !elementScope) {
            return;
        }
        data = (0, inlinejs_1.GetTarget)(data);
        data = (((0, inlinejs_1.IsObject)(data) && data) || {});
        let config = null;
        if ('$config' in data) {
            config = data['$config'];
            delete data['$config'];
        }
        if ((0, inlinejs_1.IsObject)(config === null || config === void 0 ? void 0 : config.locals)) {
            Object.entries(config.locals).forEach(([key, value]) => elementScope.SetLocal(key, value));
        }
        let proxy = component.GetRootProxy().GetNative(), proxyTarget = (0, inlinejs_1.GetTarget)(proxy), target, key = `$${inlinejs_1.ContextKeys.scope}`;
        if (component.GetRoot() !== contextElement) { //Add new scope
            let scope = component.CreateScope(contextElement);
            if (!scope) {
                (0, inlinejs_1.JournalError)('Failed to create component scope.', 'DataDirectiveHandler', contextElement);
                return;
            }
            let scopeId = scope.GetId();
            if (config === null || config === void 0 ? void 0 : config.name) {
                scope.SetName(config.name);
            }
            (0, inlinejs_1.PushCurrentScope)(component, scopeId);
            elementScope.AddPostProcessCallback(() => (0, inlinejs_1.PopCurrentScope)(componentId));
            target = {};
            proxy[scopeId] = target; //FindComponentById(componentId)?.FindScopeById(scopeId)?.GetName()
            let local = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
                getter: (prop) => {
                    var _a;
                    let scope = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative()[scopeId];
                    return ((scope && prop) ? scope[prop] : undefined);
                },
                setter: (prop, value) => {
                    var _a;
                    let scope = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative()[scopeId];
                    return ((scope && prop) ? (scope[prop] = value) : true);
                },
                lookup: () => true,
            }));
            let parentLocal = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
                getter: (prop) => {
                    let component = (0, inlinejs_1.FindComponentById)(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                    return ((parent && !(0, inlinejs_1.GetGlobal)().IsNothing(parent) && prop) ? parent[prop] : undefined);
                },
                setter: (prop, value) => {
                    let component = (0, inlinejs_1.FindComponentById)(componentId), parent = component === null || component === void 0 ? void 0 : component.FindElementLocalValue(((component === null || component === void 0 ? void 0 : component.FindAncestor(contextElement)) || ''), key, true);
                    return ((parent && !(0, inlinejs_1.GetGlobal)().IsNothing(parent) && prop) ? (parent[prop] = value) : true);
                },
                lookup: () => true,
            }));
            elementScope.SetLocal(key, local);
            elementScope.SetLocal('$parent', parentLocal);
            (config === null || config === void 0 ? void 0 : config.name) && elementScope.SetLocal('$name', config.name);
            elementScope.AddUninitCallback(() => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.RemoveScope(scopeId); });
        }
        else { //Root scope
            target = proxyTarget;
            elementScope.SetLocal('$parent', null);
            elementScope.SetLocal('$name', ((config === null || config === void 0 ? void 0 : config.name) || ''));
            elementScope.SetLocal('$componentName', ((config === null || config === void 0 ? void 0 : config.name) || ''));
            elementScope.SetLocal(key, (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
                getter: (prop) => (prop ? proxy[prop] : undefined),
                setter: (prop, value) => {
                    return (prop ? (proxy[prop] = value) : true);
                },
                lookup: () => true,
            })));
            if (config === null || config === void 0 ? void 0 : config.reactiveState) {
                component.SetReactiveState(config.reactiveState);
            }
            if (config === null || config === void 0 ? void 0 : config.name) {
                component.SetName(config.name);
            }
        }
        Object.entries(data).forEach(([key, value]) => (target[key] = value));
        if (config === null || config === void 0 ? void 0 : config.init) { //Evaluate init callback
            let { context } = component.GetBackend();
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
});
function DataDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.DataDirectiveHandler);
}
exports.DataDirectiveHandlerCompact = DataDirectiveHandlerCompact;
