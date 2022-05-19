import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback, UseEffect, DeepCopy, IsEqual } from "@benbraide/inlinejs";
export const WatchMagicHandler = CreateMagicHandlerCallback('watch', ({ componentId, contextElement }) => {
    return (expression, callback) => {
        let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' }), firstEntry = true, lastValue = null;
        UseEffect({ componentId, contextElement, callback: () => {
                let value = evaluate(), result = null;
                if (!firstEntry && !IsEqual(value, lastValue)) {
                    result = callback(value);
                }
                firstEntry = false;
                lastValue = DeepCopy(value);
                return result;
            } });
    };
});
export function WatchMagicHandlerCompact() {
    AddMagicHandler(WatchMagicHandler);
}
