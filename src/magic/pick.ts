import { AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const PickMagicHandler = CreateMagicHandlerCallback('pick', () => {
    return (pred: any, trueValue: any, falseValue: any) => (!!pred ? trueValue : falseValue);
});

export function PickMagicHandlerCompact(){
    AddMagicHandler(PickMagicHandler);
}
