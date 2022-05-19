import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback, UseEffect, DeepCopy, IsEqual } from "@benbraide/inlinejs";

export const WatchMagicHandler = CreateMagicHandlerCallback('watch', ({ componentId, contextElement }) => {
    return (expression: string, callback: (value: any) => void) => {
        let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' }), firstEntry = true, lastValue: any = null;
        UseEffect({ componentId, contextElement, callback: () => {
            let value = evaluate(), result: any = null;
            if (!firstEntry && !IsEqual(value, lastValue)){
                result = callback(value);
            }

            firstEntry = false;
            lastValue = DeepCopy(value);

            return result;
        } });
    }
});

export function WatchMagicHandlerCompact(){
    AddMagicHandler(WatchMagicHandler);
}
