import { AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const InlineJSMagicHandler = CreateMagicHandlerCallback('inlinejs', () => (globalThis['InlineJS'] || null));
export function InlineJSMagicHandlerCompact() {
    AddMagicHandler(InlineJSMagicHandler);
}
