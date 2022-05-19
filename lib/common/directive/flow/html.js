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
    var { componentId, contextElement } = _a, rest = __rest(_a, ["componentId", "contextElement"]);
    let checkpoint = 0;
    (0, inlinejs_1.LazyCheck)(Object.assign(Object.assign({ componentId, contextElement }, rest), { callback: (value) => {
            let myCheckpoint = ++checkpoint;
            (0, inlinejs_1.StreamData)(value, (value) => {
                if (myCheckpoint == checkpoint) {
                    (0, inlinejs_1.InsertHtml)({
                        element: contextElement,
                        html: value,
                        component: componentId,
                        processDirectives: true,
                    });
                }
            });
        } }));
});
function HtmlDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.HtmlDirectiveHandler);
}
exports.HtmlDirectiveHandlerCompact = HtmlDirectiveHandlerCompact;
