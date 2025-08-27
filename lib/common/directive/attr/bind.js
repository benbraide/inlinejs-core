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
exports.BindDirectiveHandlerCompact = exports.BindDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.BindDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('bind', (_a) => {
    var _b, _c;
    var { componentId, component, contextElement, argKey, argOptions, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "argKey", "argOptions", "expression"]);
    argKey = argKey.trim();
    if (argKey === 'key') {
        return (_c = (_b = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.SetKey(expression);
    }
    const options = (0, inlinejs_1.ResolveOptions)({
        options: {
            camel: false,
            floatRange: false,
        },
        list: argOptions,
    });
    const setAttribute = (key, value) => {
        options.camel && (key = (0, inlinejs_1.ToCamelCase)(key));
        const isBoolean = (0, inlinejs_1.IsBooleanAttribute)(contextElement, key);
        if (value || ((value === 0 || value === '') && !isBoolean)) { //Set
            contextElement.setAttribute(key, (isBoolean ? key : (0, inlinejs_1.ToString)(value)));
        }
        else { //Remove
            contextElement.removeAttribute(key);
        }
    };
    const passVaalue = (value) => {
        if (argKey) {
            setAttribute(argKey, value);
        }
        else if ((0, inlinejs_1.IsObject)(value)) {
            Object.entries(value).forEach(([key, value]) => setAttribute(key, value));
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
function BindDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.BindDirectiveHandler);
    (0, inlinejs_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(inlinejs_1.BindDirectiveExpansionRule);
}
exports.BindDirectiveHandlerCompact = BindDirectiveHandlerCompact;
