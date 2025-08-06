import { AddMagicHandler, BuildGetterProxyOptions, CreateInplaceProxy, CreateMagicHandlerCallback, RandomString, ToCamelCase, ToSnakeCase, ToString, } from "@benbraide/inlinejs";
export const InlineJSMagicHandler = CreateMagicHandlerCallback('inlinejs', () => (globalThis['InlineJS'] || null));
export const InlineJSGlobalMagicHandler = CreateMagicHandlerCallback('global', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['global']) || null));
export const InlineJSUtilitiesMagicHandler = CreateMagicHandlerCallback('utilities', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['utilities']) || null));
export const InlineJSValuesMagicHandler = CreateMagicHandlerCallback('values', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['values']) || null));
export const InlineJSVersionMagicHandler = CreateMagicHandlerCallback('version', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['version']) || null));
const strProps = {
    convert: (value) => ToString(value),
    camelCase: (value, ucfirst, separator) => ToCamelCase(value, ucfirst, separator),
    snakeCase: (value, separator) => ToSnakeCase(value, separator),
    random: (length = 9) => RandomString(length),
    slug: (value) => (value || '').replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').toLowerCase(),
};
let strProxy = null;
export const InlineJSStrMagicHandler = CreateMagicHandlerCallback('str', () => strProxy = strProxy || CreateInplaceProxy(BuildGetterProxyOptions({
    getter: prop => ((prop && strProps.hasOwnProperty(prop)) ? strProps[prop] : undefined),
    lookup: Object.keys(strProps),
})));
export function InlineJSMagicHandlerCompact() {
    AddMagicHandler(InlineJSMagicHandler);
    AddMagicHandler(InlineJSGlobalMagicHandler);
    AddMagicHandler(InlineJSUtilitiesMagicHandler);
    AddMagicHandler(InlineJSValuesMagicHandler);
    AddMagicHandler(InlineJSVersionMagicHandler);
    AddMagicHandler(InlineJSStrMagicHandler);
}
