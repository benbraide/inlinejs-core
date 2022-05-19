import { AddMagicHandler, CreateMagicHandlerCallback, GetTarget } from "@benbraide/inlinejs";
export const NativeMagicHandler = CreateMagicHandlerCallback('ancestor', () => GetTarget);
export function NativeMagicHandlerCompact() {
    AddMagicHandler(NativeMagicHandler);
}
