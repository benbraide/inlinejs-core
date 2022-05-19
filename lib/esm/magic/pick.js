import { AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const PickMagicHandler = CreateMagicHandlerCallback('pick', () => {
    return (pred, trueValue, falseValue) => (!!pred ? trueValue : falseValue);
});
export function PickMagicHandlerCompact() {
    AddMagicHandler(PickMagicHandler);
}
