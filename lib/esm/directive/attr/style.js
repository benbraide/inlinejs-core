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
import { AddDirectiveHandler, CreateDirectiveHandlerCallback, ToString, ToCamelCase, ResolveOptions, IsObject, LazyCheck, StreamData, ConsiderRange } from "@benbraide/inlinejs";
export const StyleDirectiveHandler = CreateDirectiveHandlerCallback('style', (_a) => {
    var { componentId, component, contextElement, argKey, argOptions, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "argKey", "argOptions", "expression"]);
    const options = ResolveOptions({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    const setStyle = (key, value) => {
        key = ToCamelCase(key, false, '.');
        if (key in contextElement.style) {
            contextElement.style[key] = ToString(value);
        }
    };
    const passVaalue = (value) => {
        if (argKey) {
            setStyle(argKey, value);
        }
        else if (IsObject(value)) {
            Object.entries(value).forEach(([key, value]) => setStyle(key, value));
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
export function StyleDirectiveHandlerCompact() {
    AddDirectiveHandler(StyleDirectiveHandler);
}
