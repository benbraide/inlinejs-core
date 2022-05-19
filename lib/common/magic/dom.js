"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomMagicHandlerCompact = exports.DomMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const props = {
    root: ({ componentId }) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetRoot(); },
    form: ({ componentId, contextElement }) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElement(contextElement, el => (el instanceof HTMLElement)); },
    ancestor: ({ componentId, contextElement }) => (index) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, (index || 0)); },
    parent: ({ componentId, contextElement }) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindAncestor(contextElement, 0); },
};
let proxy = null;
exports.DomMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('dom', (params) => {
    return (proxy || (proxy = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({
        getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)) {
                return props[prop](params);
            }
        },
        lookup: Object.keys(props),
    }))));
});
function DomMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.DomMagicHandler);
}
exports.DomMagicHandlerCompact = DomMagicHandlerCompact;
