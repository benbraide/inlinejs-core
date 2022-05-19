import { AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";

const methods = {
    or: (...values: any[]) => values.at(values.findIndex(value => !!value)),
    and: (...values: any[]) => values.at(values.findIndex(value => !value)),
};

let proxy: object | null = null;

export const LogicalMagicHandler = CreateMagicHandlerCallback('log', () => (proxy || (proxy = CreateReadonlyProxy(methods))));

export function LogicalMagicHandlerCompact(){
    AddMagicHandler(LogicalMagicHandler);
}
