import { AddMagicHandler, CreateMagicHandlerCallback, GetTarget } from "@benbraide/inlinejs";
export const NativeMagicHandler = CreateMagicHandlerCallback('native', () => GetTarget);
export function NativeMagicHandlerCompact() {
    AddMagicHandler(NativeMagicHandler);
}
