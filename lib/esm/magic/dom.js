var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy } from "@benbraide/inlinejs";
const props = {
    root: ({ componentId }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot(); },
    form: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElement(contextElement, el => (el instanceof HTMLFormElement)); },
    ancestor: ({ componentId, contextElement }) => (index) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, (index || 0)); },
    parent: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, 0); },
    window: () => globalThis,
    document: () => globalThis.document,
    console: () => globalThis.console,
    log: () => ((...args) => globalThis.console.log(...args)),
    alert: () => ((...args) => globalThis.alert(...args)),
};
export const DomMagicHandler = CreateMagicHandlerCallback('dom', (_a) => {
    var { contextElement, componentId, component } = _a, rest = __rest(_a, ["contextElement", "componentId", "component"]);
    return CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            var _a;
            if (prop && props.hasOwnProperty(prop)) {
                return props[prop](Object.assign({ contextElement, componentId, component }, rest));
            }
            if (prop === 'siblings') {
                if (!contextElement.parentElement || contextElement === ((_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetRoot())) {
                    return () => null;
                }
                return (index) => {
                    var _a;
                    const children = [...(((_a = contextElement.parentElement) === null || _a === void 0 ? void 0 : _a.children) || [])];
                    if (index === 'prev' || index === 'previous') {
                        const index = children.findIndex(child => (child === contextElement));
                        return ((index > 0) ? (children.at(index - 1) || null) : null);
                    }
                    if (index === 'next') {
                        const index = children.findIndex(child => (child === contextElement));
                        return ((index >= 0 && index < (children.length - 1)) ? (children.at(index + 1) || null) : null);
                    }
                    if (typeof index === 'number') {
                        return (children.filter(child => (child !== contextElement)).at(index) || null);
                    }
                    if (index === 'first') {
                        return (children.filter(child => (child !== contextElement)).at(0) || null);
                    }
                    if (index === 'last') {
                        return (children.filter(child => (child !== contextElement)).at(-1) || null);
                    }
                    return children.filter(child => (child !== contextElement));
                };
            }
        },
        lookup: [...Object.keys(props), 'siblings'],
    }));
});
export function DomMagicHandlerCompact() {
    AddMagicHandler(DomMagicHandler);
}
