"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlDirectiveHandlerCompact = exports.HtmlDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.HtmlDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('html', (_a) => {
    var { componentId, contextElement, argOptions } = _a, rest = __rest(_a, ["componentId", "contextElement", "argOptions"]);
    let checkpoint = 0;
    const storedProxyHandler = (0, inlinejs_1.StoreProxyHandler)(componentId), options = (0, inlinejs_1.ResolveOptions)({
        options: {
            noremovefalse: false,
            noremovenull: false,
            noremoveundefined: false,
            noinsertfalse: false,
            noinsertnull: false,
            noinsertundefined: false,
        },
        list: argOptions,
    });
    (0, inlinejs_1.LazyCheck)(Object.assign(Object.assign({ componentId, contextElement, argOptions }, rest), { callback: (value) => {
            const myCheckpoint = ++checkpoint, noRemoveList = new Array(), noInsertList = new Array();
            options.noremovefalse && noRemoveList.push(false);
            options.noremovenull && noRemoveList.push(null);
            options.noremoveundefined && noRemoveList.push(undefined);
            options.noinsertfalse && noInsertList.push(false);
            options.noinsertnull && noInsertList.push(null);
            options.noinsertundefined && noInsertList.push(undefined);
            (0, inlinejs_1.StreamData)(value, (value) => {
                (myCheckpoint == checkpoint) && storedProxyHandler(() => (0, inlinejs_1.InsertHtml)({
                    element: contextElement,
                    html: value,
                    component: componentId,
                    processDirectives: true,
                    useTransition: true,
                    beforeRemove: noRemoveList.length == 0 ? undefined : beforeTransition => beforeTransition && noRemoveList.includes(value) ? false : undefined,
                    beforeInsert: noInsertList.length == 0 ? undefined : () => noInsertList.includes(value) ? false : undefined,
                }));
            });
        } }));
});
function HtmlDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.HtmlDirectiveHandler);
}
exports.HtmlDirectiveHandlerCompact = HtmlDirectiveHandlerCompact;
