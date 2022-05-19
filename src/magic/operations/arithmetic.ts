import { AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";

const methods = {
    add: (...values: number[]) => values.reduce((acc, value) => (acc + value)),
    subtract: (...values: number[]) => values.reduce((acc, value) => (acc - value)),
    multiply: (...values: number[]) => values.reduce((acc, value) => (acc * value)),
    divide: (...values: number[]) => values.reduce((acc, value) => (acc / value)),
};

let proxy: object | null = null;

export const ArithmeticMagicHandler = CreateMagicHandlerCallback('math', () => (proxy || (proxy = CreateReadonlyProxy(methods))));

export function ArithmeticMagicHandlerCompact(){
    AddMagicHandler(ArithmeticMagicHandler);
}
