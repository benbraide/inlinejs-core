import { AddMagicHandler, CreateMagicHandlerCallback, CreateReadonlyProxy } from "@benbraide/inlinejs";
const methods = {
    or: (...values) => values.at(values.findIndex(value => !!value)),
    and: (...values) => values.at(values.findIndex(value => !value)),
};
let proxy = null;
export const LogicalMagicHandler = CreateMagicHandlerCallback('log', () => (proxy || (proxy = CreateReadonlyProxy(methods))));
export function LogicalMagicHandlerCompact() {
    AddMagicHandler(LogicalMagicHandler);
}
