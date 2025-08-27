import { AddMagicHandler, CreateMagicHandlerCallback, GetGlobal, RangeValueType } from "@benbraide/inlinejs";

export const RangeMagicHandler = CreateMagicHandlerCallback('range', () => {
    return (from: RangeValueType, to: RangeValueType, duration = 0, delay = 0) => {
        return duration > 0 ? GetGlobal().CreateTimedRange(from, to, duration, delay) : GetGlobal().CreateRange(from, to);
    };
});

export function RangeMagicHandlerCompact(){
    AddMagicHandler(RangeMagicHandler);
}
