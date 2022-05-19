import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, FindComponentById, ResolveKeyValue, ResolveOptions, ToCamelCase } from "@benbraide/inlinejs";

export const BindDirectiveHandler = CreateDirectiveHandlerCallback('bind', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    argKey = argKey.trim();
    if (argKey === 'key'){
        return (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.SetKey(expression);
    }

    let options = ResolveOptions({ options: { camel: false }, list: argOptions});
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey,
        callback: ([key, value]) => {
            key = (options.camel ? ToCamelCase(key) : key);
            let isBoolean = GetGlobal().GetConfig().IsBooleanAttribute(key);
            if (value || ((value === 0 || value === '') && !isBoolean)){//Set
                contextElement.setAttribute(key, (isBoolean ? key : ToString(value)));
            }
            else{//Remove
                contextElement.removeAttribute(key);
            }
        },
    });
});

export function BindDirectiveExpansionRule(name: string){
    return (name.startsWith(':') ? (GetGlobal().GetConfig().GetDirectiveName('bind') + name) : null);
}

export function BindDirectiveHandlerCompact(){
    AddDirectiveHandler(BindDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
