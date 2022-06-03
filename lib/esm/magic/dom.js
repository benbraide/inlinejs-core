import { FindComponentById, AddMagicHandler, CreateMagicHandlerCallback, BuildGetterProxyOptions, CreateInplaceProxy } from "@benbraide/inlinejs";
const props = {
    root: ({ componentId }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot(); },
    form: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElement(contextElement, el => (el instanceof HTMLFormElement)); },
    ancestor: ({ componentId, contextElement }) => (index) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, (index || 0)); },
    parent: ({ componentId, contextElement }) => { var _a; return (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, 0); },
};
let proxy = null;
export const DomMagicHandler = CreateMagicHandlerCallback('dom', (params) => {
    return (proxy || (proxy = CreateInplaceProxy(BuildGetterProxyOptions({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)) {
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});
export function DomMagicHandlerCompact() {
    AddMagicHandler(DomMagicHandler);
}
