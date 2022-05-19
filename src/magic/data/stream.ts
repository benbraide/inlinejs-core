import { StreamData, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const StreamMagicHandler = CreateMagicHandlerCallback('stream', () => {
    return (value: any, callback: (value: any) => any) => StreamData(value, callback);
});

export function StreamMagicHandlerCompact(){
    AddMagicHandler(StreamMagicHandler);
}
