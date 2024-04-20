import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback, UseEffect, DeepCopy, IsEqual } from "@benbraide/inlinejs";
export const WatchMagicHandler = CreateMagicHandlerCallback('watch', ({ componentId, contextElement }) => {
    return (expression, callback) => {
        const evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' });
        let firstEntry = true, lastValue = null;
        UseEffect({ componentId, contextElement, callback: () => {
                const value = evaluate();
                let result = null;
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
