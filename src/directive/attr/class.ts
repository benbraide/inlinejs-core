import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, ResolveKeyValue, ClassDirectiveExpansionRule } from "@benbraide/inlinejs";

export const ClassDirectiveHandler = CreateDirectiveHandlerCallback('class', ({ componentId, contextElement, expression, argKey }) => {
    const split = (key: string) => key.split(' ').filter(item => !!item);
    const add = (key: string) => contextElement.classList.add(key), remove = (key: string) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    
    let previousList: Array<string> | null = null;
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => split(key).forEach(value ? add : remove),
        arrayCallback: (list) => {
            const validList = list.map(item => ToString(item)).filter(item => !!item);
            (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
            (previousList ? validList.filter(item => !previousList!.includes(item)) : validList).forEach(add);
            previousList = validList;
        },
    });
});

export function ClassDirectiveHandlerCompact(){
    AddDirectiveHandler(ClassDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
}
