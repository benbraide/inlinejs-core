import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, UseEffect } from "@benbraide/inlinejs";
export const EffectDirectiveHandler = CreateDirectiveHandlerCallback('effect', ({ componentId, contextElement, expression }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true });
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(),
    });
});
export function EffectDirectiveHandlerCompact() {
    AddDirectiveHandler(EffectDirectiveHandler);
}
