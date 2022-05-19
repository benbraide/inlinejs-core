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
exports.TextDirectiveHandlerCompact = exports.TextDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.TextDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('text', (_a) => {
    var { contextElement } = _a, rest = __rest(_a, ["contextElement"]);
    let checkpoint = 0;
    (0, inlinejs_1.LazyCheck)(Object.assign(Object.assign({ contextElement }, rest), { callback: (value) => {
            let myCheckpoint = ++checkpoint;
            (0, inlinejs_1.StreamData)(value, (value) => {
                if (myCheckpoint == checkpoint) {
                    contextElement.textContent = (0, inlinejs_1.ToString)(value);
                }
            });
        } }));
});
function TextDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.TextDirectiveHandler);
}
exports.TextDirectiveHandlerCompact = TextDirectiveHandlerCompact;
