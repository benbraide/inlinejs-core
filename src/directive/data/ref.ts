import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";

export const RefDirectiveHandler = CreateDirectiveHandlerCallback('ref', ({ componentId, component, contextElement, expression, argKey }) => {
    if ((component || FindComponentById(componentId))?.CreateElementScope(contextElement)?.IsInitialized()){
        return;
    }
    
    if (argKey === 'evaluate'){
        EvaluateLater({ componentId, contextElement, expression })(data => FindComponentById(componentId)?.AddRefElement(ToString(data), contextElement));
    }
    else{//Raw expression
        (component || FindComponentById(componentId))?.AddRefElement(expression, contextElement);
    }
});

export function RefDirectiveHandlerCompact(){
    AddDirectiveHandler(RefDirectiveHandler);
}
