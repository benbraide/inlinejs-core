import { AddMagicHandler, CreateMagicHandlerCallback, Loop } from "@benbraide/inlinejs";

export const WaitingMagicHandler = CreateMagicHandlerCallback('waiting', () => {
    return (value: any) => {
        if (value instanceof Promise){
            return new Promise<boolean>((resolve, reject) => {
                value.then(() => resolve(false)).catch(reject);
            });
        }

        if (value instanceof Loop){
            return new Promise<boolean>((resolve) => {
                value.Final(() => resolve(false));
            });
        }
        
        return false;
    };
});

export function WaitingMagicHandlerCompact(){
    AddMagicHandler(WaitingMagicHandler);
}
