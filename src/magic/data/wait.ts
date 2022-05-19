import { WaitPromise, WaitWhile, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const WaitMagicHandler = CreateMagicHandlerCallback('wait', () => {
    return (value: any, callback: (value: any) => void) => WaitPromise(value, value => WaitWhile(value, callback, callback));
});

export function WaitMagicHandlerCompact(){
    AddMagicHandler(WaitMagicHandler);
}
