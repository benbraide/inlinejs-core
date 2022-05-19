import { WaitPromise, WaitWhile, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const WaitMagicHandler = CreateMagicHandlerCallback('wait', () => {
    return (value, callback) => WaitPromise(value, value => WaitWhile(value, callback, callback));
});
export function WaitMagicHandlerCompact() {
    AddMagicHandler(WaitMagicHandler);
}
