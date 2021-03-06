import { AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";
const methods = {
    add: (...values) => values.reduce((acc, value) => (acc + value)),
    subtract: (...values) => values.reduce((acc, value) => (acc - value)),
    multiply: (...values) => values.reduce((acc, value) => (acc * value)),
    divide: (...values) => values.reduce((acc, value) => (acc / value)),
};
let proxy = null;
export const ArithmeticMagicHandler = CreateMagicHandlerCallback('math', () => (proxy || (proxy = CreateReadonlyProxy(methods))));
export function ArithmeticMagicHandlerCompact() {
    AddMagicHandler(ArithmeticMagicHandler);
}
