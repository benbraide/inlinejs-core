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
exports.StyleDirectiveHandlerCompact = exports.StyleDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StyleDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('style', (_a) => {
    var { componentId, component, contextElement, argKey, argOptions, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "argKey", "argOptions", "expression"]);
    const options = (0, inlinejs_1.ResolveOptions)({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    const setStyle = (key, value) => {
        key = (0, inlinejs_1.ToCamelCase)(key, false, '.');
        if (key in contextElement.style) {
            contextElement.style[key] = (0, inlinejs_1.ToString)(value);
        }
    };
    const passVaalue = (value) => {
        if (argKey) {
            setStyle(argKey, value);
        }
        else if ((0, inlinejs_1.IsObject)(value)) {
            Object.entries(value).forEach(([key, value]) => setStyle(key, value));
        }
    };
    let checkpoint = 0, rangeCheckpoint = 0;
    (0, inlinejs_1.LazyCheck)(Object.assign(Object.assign({ componentId, component, contextElement, argKey, argOptions, expression }, rest), { callback: (value) => {
            const myCheckpoint = ++checkpoint;
            (0, inlinejs_1.StreamData)(value, (value) => {
                if (myCheckpoint !== checkpoint)
                    return;
                const myRangeCheckpoint = ++rangeCheckpoint;
                (0, inlinejs_1.ConsiderRange)(value, (value) => {
                    if (myCheckpoint !== checkpoint || myRangeCheckpoint !== rangeCheckpoint)
                        return false;
                    passVaalue(value);
                }, 3000, 1000, !options.floatRange);
            });
        } }));
});
function StyleDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.StyleDirectiveHandler);
}
exports.StyleDirectiveHandlerCompact = StyleDirectiveHandlerCompact;
