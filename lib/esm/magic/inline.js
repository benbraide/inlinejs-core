import { AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const InlineJSMagicHandler = CreateMagicHandlerCallback('inlinejs', () => (globalThis['InlineJS'] || null));
export const InlineJSGlobalMagicHandler = CreateMagicHandlerCallback('global', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['global']) || null));
export const InlineJSUtilitiesMagicHandler = CreateMagicHandlerCallback('utilities', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['utilities']) || null));
export const InlineJSValuesMagicHandler = CreateMagicHandlerCallback('values', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['values']) || null));
export const InlineJSRandomMagicHandler = CreateMagicHandlerCallback('random', () => {
    return (length = 9) => {
        const rand = (globalThis['InlineJS'] && globalThis['InlineJS']['utilities'] && globalThis['InlineJS']['utilities']['getRandomString']);
        return (rand ? rand(length) : null);
    };
});
export function InlineJSMagicHandlerCompact() {
    AddMagicHandler(InlineJSMagicHandler);
    AddMagicHandler(InlineJSGlobalMagicHandler);
    AddMagicHandler(InlineJSUtilitiesMagicHandler);
    AddMagicHandler(InlineJSValuesMagicHandler);
    AddMagicHandler(InlineJSRandomMagicHandler);
}
