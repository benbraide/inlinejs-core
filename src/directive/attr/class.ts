import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, ResolveKeyValue, ClassDirectiveExpansionRule, ResolveOptions, IsObject, LazyCheck, StreamData, ConsiderRange } from "@benbraide/inlinejs";

export const ClassDirectiveHandler = CreateDirectiveHandlerCallback('class', ({ componentId, component, contextElement, argKey, argOptions, expression, ...rest }) => {
    const options = ResolveOptions({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    
    const split = (key: string) => key.split(' ').filter(item => !!item);
    const add = (key: string) => contextElement.classList.add(key), remove = (key: string) => (contextElement.classList.contains(key) && contextElement.classList.remove(key));
    
    const setClass = (key: string, value: any) => {
        split(key).forEach(value ? add : remove);
    };

    let previousList: Array<string> | null = null;
    
    const setArray = (list: Array<string>) => {
        const validList = list.map(item => ToString(item)).filter(item => !!item);
        (previousList || []).filter(item => !validList.includes(item)).forEach(remove);
        (previousList ? validList.filter(item => !previousList!.includes(item)) : validList).forEach(add);
        previousList = validList;
    };

    const passVaalue = (value: any) => {
        if (argKey){
            setClass(argKey, value);
        }
        else if (IsObject(value)){
            Object.entries(value).forEach(([key, value]) => setClass(key, value));
        }
        else if (typeof value === 'string'){
            setArray(split(value));
        }
        else if (Array.isArray(value)){
            setArray(value);
        }
    };

    let checkpoint = 0, rangeCheckpoint = 0;
    LazyCheck({ componentId, component, contextElement, argKey, argOptions, expression, ...rest,
        callback: (value) => {
            const myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint !== checkpoint) return;

                const myRangeCheckpoint = ++rangeCheckpoint;
                ConsiderRange(value, (value) => {
                    if (myCheckpoint !== checkpoint || myRangeCheckpoint !== rangeCheckpoint) return false;
                    passVaalue(value);
                }, 3000, 1000, !options.floatRange);
            });
        },
    });
});

export function ClassDirectiveHandlerCompact(){
    AddDirectiveHandler(ClassDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(ClassDirectiveExpansionRule);
}
