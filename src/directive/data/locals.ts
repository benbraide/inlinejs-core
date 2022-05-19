import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetTarget, IsObject } from "@benbraide/inlinejs";

export const LocalsDirectiveHandler = CreateDirectiveHandlerCallback('locals', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression })((data) => {
        let elementScope = FindComponentById(componentId)?.FindElementScope(contextElement);

        data = GetTarget(data);
        data = ((IsObject(data) && data) || {});

        Object.entries(data).forEach(([key, value]) => elementScope?.SetLocal(key, value));
    });
});

export function LocalsDirectiveHandlerCompact(){
    AddDirectiveHandler(LocalsDirectiveHandler);
}
