import { AddDirectiveHandler, CreateDirectiveHandlerCallback, ToString, ResolveKeyValue, ToCamelCase, ResolveOptions, IsObject, LazyCheck, StreamData, ConsiderRange } from "@benbraide/inlinejs";

export const StyleDirectiveHandler = CreateDirectiveHandlerCallback('style', ({ componentId, component, contextElement, argKey, argOptions, expression, ...rest }) => {
    const options = ResolveOptions({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    
    const setStyle = (key: string, value: any) => {
        key = ToCamelCase(key, false, '.');
        if (key in contextElement.style){
            contextElement.style[key] = ToString(value);
        }
    };

    const passVaalue = (value: any) => {
        if (argKey){
            setStyle(argKey, value);
        }
        else if (IsObject(value)){
            Object.entries(value).forEach(([key, value]) => setStyle(key, value));
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

export function StyleDirectiveHandlerCompact(){
    AddDirectiveHandler(StyleDirectiveHandler);
}
