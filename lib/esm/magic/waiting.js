import { AddMagicHandler, CreateMagicHandlerCallback, Loop } from "@benbraide/inlinejs";
export const WaitingMagicHandler = CreateMagicHandlerCallback('waiting', () => {
    return (value) => {
        if (value instanceof Promise) {
            return new Promise((resolve, reject) => {
                value.then(() => resolve(false)).catch(reject);
            });
        }
        if (value instanceof Loop) {
            return new Promise((resolve) => {
                value.Final(() => resolve(false));
            });
        }
        return false;
    };
});
export function WaitingMagicHandlerCompact() {
    AddMagicHandler(WaitingMagicHandler);
}
