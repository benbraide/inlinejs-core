import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback } from "@benbraide/inlinejs";

export const FunctionMagicHandler = CreateMagicHandlerCallback('func', ({ componentId, contextElement }) => {
    return (expression: string) => EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true });
});

export const EvaluateMagicHandler = CreateMagicHandlerCallback('eval', ({ componentId, contextElement }) => {
    return (expression: string, callback?: (value: any) => void) => EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })(callback);
});

export function EvaluateMagicHandlerCompact(){
    AddMagicHandler(FunctionMagicHandler);
    AddMagicHandler(EvaluateMagicHandler);
}
