import { AddDirectiveHandler, CreateDirectiveHandlerCallback, GetGlobal, ToString, FindComponentById, ResolveKeyValue, ResolveOptions, ToCamelCase } from "@benbraide/inlinejs";
export const BindDirectiveHandler = CreateDirectiveHandlerCallback('bind', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b;
    argKey = argKey.trim();
    if (argKey === 'key') {
        return (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.SetKey(expression);
    }
    let options = ResolveOptions({ options: { camel: false }, list: argOptions });
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey,
        callback: ([key, value]) => {
            key = (options.camel ? ToCamelCase(key) : key);
            let isBoolean = GetGlobal().GetConfig().IsBooleanAttribute(key);
            if (value || ((value === 0 || value === '') && !isBoolean)) { //Set
                contextElement.setAttribute(key, (isBoolean ? key : ToString(value)));
            }
            else { //Remove
                contextElement.removeAttribute(key);
            }
        },
    });
});
export function BindDirectiveExpansionRule(name) {
    return (name.startsWith(':') ? (GetGlobal().GetConfig().GetDirectiveName('bind') + name) : null);
}
export function BindDirectiveHandlerCompact() {
    AddDirectiveHandler(BindDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(BindDirectiveExpansionRule);
}
