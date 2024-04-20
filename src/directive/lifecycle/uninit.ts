import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater } from "@benbraide/inlinejs";

export const UninitDirectiveHandler = CreateDirectiveHandlerCallback('uninit', ({ componentId, component, contextElement, expression }) => {
    const evaluate = EvaluateLater({ componentId, contextElement, expression });
    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => evaluate());
});

export function UninitDirectiveHandlerCompact(){
    AddDirectiveHandler(UninitDirectiveHandler);
}
