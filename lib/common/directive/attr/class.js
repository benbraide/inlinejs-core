"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassDirectiveHandlerCompact = exports.ClassDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ClassDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('class', ({ componentId, contextElement, expression, argKey }) => {
    const split = (key) => key.split(' ').filter(item => !!item);
    const add = (key) => contextElement.classList.add(key), remove = (key) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    let previousList = null;
    (0, inlinejs_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => split(key).forEach(value ? add : remove),
        arrayCallback: (list) => {
            const validList = list.map(item => (0, inlinejs_1.ToString)(item)).filter(item => !!item);
            (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
            (previousList ? validList.filter(item => !previousList.includes(item)) : validList).forEach(add);
            previousList = validList;
        },
    });
});
function ClassDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.ClassDirectiveHandler);
    (0, inlinejs_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(inlinejs_1.ClassDirectiveExpansionRule);
}
exports.ClassDirectiveHandlerCompact = ClassDirectiveHandlerCompact;
