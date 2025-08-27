import { AddMagicHandler, CreateMagicHandlerCallback, IProxyAccessStorage, GetGlobal } from "@benbraide/inlinejs";

let storage_: IProxyAccessStorage | null = null;

export const StaticMagicHandler = CreateMagicHandlerCallback('static', () => {
    return (value: any) => {
        GetGlobal().SetCurrentProxyAccessStorage(storage_);
        storage_ = null;
        return value;
    }
}, () => (storage_ = GetGlobal().SetCurrentProxyAccessStorage(null)));

export function StaticMagicHandlerCompact(){
    AddMagicHandler(StaticMagicHandler);
}
