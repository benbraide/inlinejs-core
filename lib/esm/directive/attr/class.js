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
import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, ClassDirectiveExpansionRule, ResolveOptions, IsObject, LazyCheck, StreamData, ConsiderRange } from "@benbraide/inlinejs";
export const ClassDirectiveHandler = CreateDirectiveHandlerCallback('class', (_a) => {
    var { componentId, component, contextElement, argKey, argOptions, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "argKey", "argOptions", "expression"]);
    const options = ResolveOptions({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    const split = (key) => key.split(' ').filter(item => !!item);
    const add = (key) => contextElement.classList.add(key), remove = (key) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    const setClass = (key, value) => {
        split(key).forEach(value ? add : remove);
    };
    let previousList = null;
    const setArray = (list) => {
        const validList = list.map(item => ToString(item)).filter(item => !!item);
        (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
        (previousList ? validList.filter(item => !previousList.includes(item)) : validList).forEach(add);
        previousList = validList;
    };
    const passVaalue = (value) => {
        if (argKey) {
            setClass(argKey, value);
        }
        else if (IsObject(value)) {
            Object.entries(value).forEach(([key, value]) => setClass(key, value));
        }
        else if (typeof value === 'string') {
            setArray(split(value));
        }
        else if (Array.isArray(value)) {
            setArray(value);
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
export function ClassDirectiveHandlerCompact() {
    AddDirectiveHandler(ClassDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
}
