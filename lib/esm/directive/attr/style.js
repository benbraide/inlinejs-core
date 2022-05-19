import { AddDirectiveHandler, CreateDirectiveHandlerCallback, ToString, ResolveKeyValue, ToCamelCase } from "@benbraide/inlinejs";
export const StyleDirectiveHandler = CreateDirectiveHandlerCallback('style', ({ componentId, contextElement, expression, argKey }) => {
    ResolveKeyValue({ componentId, contextElement, expression,
        key: argKey.trim(),
        callback: ([key, value]) => {
            key = ToCamelCase(key, false, '.');
            if (key in contextElement.style) {
                contextElement.style[key] = ToString(value);
            }
        },
    });
});
export function StyleDirectiveHandlerCompact() {
    AddDirectiveHandler(StyleDirectiveHandler);
}
