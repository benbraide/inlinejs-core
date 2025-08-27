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
import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, FindComponentById, ResolveOptions, ToCamelCase, BindDirectiveExpansionRule, IsBooleanAttribute, LazyCheck, StreamData, IsObject, ConsiderRange } from "@benbraide/inlinejs";
export const BindDirectiveHandler = CreateDirectiveHandlerCallback('bind', (_a) => {
    var _b, _c;
    var { componentId, component, contextElement, argKey, argOptions, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "argKey", "argOptions", "expression"]);
    argKey = argKey.trim();
    if (argKey === 'key') {
        return (_c = (_b = (component || FindComponentById(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.SetKey(expression);
    }
    const options = ResolveOptions({
        options: {
            camel: false,
            floatRange: false,
        },
        list: argOptions,
    });
    const setAttribute = (key, value) => {
        options.camel && (key = ToCamelCase(key));
        const isBoolean = IsBooleanAttribute(contextElement, key);
        if (value || ((value === 0 || value === '') && !isBoolean)) { //Set
            contextElement.setAttribute(key, (isBoolean ? key : ToString(value)));
        }
        else { //Remove
            contextElement.removeAttribute(key);
        }
    };
    const passVaalue = (value) => {
        if (argKey) {
            setAttribute(argKey, value);
        }
        else if (IsObject(value)) {
            Object.entries(value).forEach(([key, value]) => setAttribute(key, value));
        }
    };
    let checkpoint = 0, rangeCheckpoint = 0;
    LazyCheck(Object.assign(Object.assign({ componentId, component, contextElement, argKey, argOptions, expression }, rest), { callback: (value) => {
            const myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint !== checkpoint)
                    return;
                const myRangeCheckpoint = ++rangeCheckpoint;
                ConsiderRange(value, (value) => {
                    if (myCheckpoint !== checkpoint || myRangeCheckpoint !== rangeCheckpoint)
                        return false;
                    passVaalue(value);
                }, 3000, 1000, !options.floatRange);
            });
        } }));
});
export function BindDirectiveHandlerCompact() {
    AddDirectiveHandler(BindDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
