import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
export const RangeMagicHandler = CreateMagicHandlerCallback('range', () => {
    return (from, to, duration = 0, delay = 0) => {
        return duration > 0 ? GetGlobal().CreateTimedRange(from, to, duration, delay) : GetGlobal().CreateRange(from, to);
    };
});
export function RangeMagicHandlerCompact() {
    AddMagicHandler(RangeMagicHandler);
}
