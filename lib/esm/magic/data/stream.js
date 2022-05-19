import { StreamData, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";
export const StreamMagicHandler = CreateMagicHandlerCallback('stream', () => {
    return (value, callback) => StreamData(value, callback);
});
export function StreamMagicHandlerCompact() {
    AddMagicHandler(StreamMagicHandler);
}
