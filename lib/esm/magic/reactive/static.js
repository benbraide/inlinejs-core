import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
let storage_ = null;
export const StaticMagicHandler = CreateMagicHandlerCallback('static', () => {
    return (value) => {
        GetGlobal().SetCurrentProxyAccessStorage(storage_);
        storage_ = null;
        return value;
    };
}, () => (storage_ = GetGlobal().SetCurrentProxyAccessStorage(null)));
export function StaticMagicHandlerCompact() {
    AddMagicHandler(StaticMagicHandler);
}
