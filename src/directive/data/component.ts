import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";

export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    if ((component || FindComponentById(componentId))?.CreateElementScope(contextElement)?.IsInitialized()){
        return;
    }
    
    const updateName = (name: string) => {
        const resolvedComponent = FindComponentById(componentId);
        if (resolvedComponent && resolvedComponent.GetRoot() === contextElement){
            resolvedComponent.SetName(name);
            resolvedComponent.FindElementScope(contextElement)?.SetLocal('$name', name);
        }
    };
    
    if (argKey === 'evaluate'){
        EvaluateLater({ componentId, contextElement, expression })(data => updateName(ToString(data)));
    }
    else{//Raw expression
        updateName(expression);
    }
});

export function ComponentDirectiveHandlerCompact(){
    AddDirectiveHandler(ComponentDirectiveHandler);
}
