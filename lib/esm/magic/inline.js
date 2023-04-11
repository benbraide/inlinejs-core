import { AddMagicHandler, CreateMagicHandlerCallback, RandomString } from "@benbraide/inlinejs";
export const InlineJSMagicHandler = CreateMagicHandlerCallback('inlinejs', () => (globalThis['InlineJS'] || null));
export const InlineJSGlobalMagicHandler = CreateMagicHandlerCallback('global', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['global']) || null));
export const InlineJSUtilitiesMagicHandler = CreateMagicHandlerCallback('utilities', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['utilities']) || null));
export const InlineJSValuesMagicHandler = CreateMagicHandlerCallback('values', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['values']) || null));
export const InlineJSVersionMagicHandler = CreateMagicHandlerCallback('version', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['version']) || null));
export const InlineJSRandomMagicHandler = CreateMagicHandlerCallback('randstr', () => {
    return (length = 9) => RandomString(length);
});
export function InlineJSMagicHandlerCompact() {
    AddMagicHandler(InlineJSMagicHandler);
    AddMagicHandler(InlineJSGlobalMagicHandler);
    AddMagicHandler(InlineJSUtilitiesMagicHandler);
    AddMagicHandler(InlineJSValuesMagicHandler);
    AddMagicHandler(InlineJSVersionMagicHandler);
    AddMagicHandler(InlineJSRandomMagicHandler);
}
