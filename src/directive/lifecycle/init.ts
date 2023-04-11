import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById } from "@benbraide/inlinejs";

export const InitDirectiveHandler = CreateDirectiveHandlerCallback('init', ({ componentId, component, contextElement, expression }) => {
    if (!(component || FindComponentById(componentId))?.CreateElementScope(contextElement)?.IsInitialized()){
        EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })();
    }
});

export function InitDirectiveHandlerCompact(){
    AddDirectiveHandler(InitDirectiveHandler);
}
