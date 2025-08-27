import {
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    GetGlobal,
    ToString,
    FindComponentById,
    ResolveKeyValue,
    ResolveOptions,
    ToCamelCase,
    BindDirectiveExpansionRule,
    IsBooleanAttribute,
    LazyCheck,
    StreamData,
    UseRange,
    IsObject,
    ConsiderRange
} from "@benbraide/inlinejs";

export const BindDirectiveHandler = CreateDirectiveHandlerCallback('bind', ({ componentId, component, contextElement, argKey, argOptions, expression, ...rest }) => {
    argKey = argKey.trim();
    if (argKey === 'key'){
        return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.SetKey(expression);
    }

    const options = ResolveOptions({
        options: {
            camel: false,
            floatRange: false,
        },
        list: argOptions,
    });

    const setAttribute = (key: string, value: any) => {
        options.camel && (key = ToCamelCase(key));
        
        const isBoolean = IsBooleanAttribute(contextElement, key);
        if (value || ((value === 0 || value === '') && !isBoolean)){//Set
            contextElement.setAttribute(key, (isBoolean ? key : ToString(value)));
        }
        else{//Remove
            contextElement.removeAttribute(key);
        }
    };

    const passVaalue = (value: any) => {
        if (argKey){
            setAttribute(argKey, value);
        }
        else if (IsObject(value)){
            Object.entries(value).forEach(([key, value]) => setAttribute(key, value));
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

export function BindDirectiveHandlerCompact(){
    AddDirectiveHandler(BindDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
