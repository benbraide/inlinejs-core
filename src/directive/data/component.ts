import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ToString } from "@benbraide/inlinejs";

export const ComponentDirectiveHandler = CreateDirectiveHandlerCallback('component', ({ componentId, component, contextElement, expression, argKey }) => {
    let updateName = (name: string) => {
        let resolveComponent = (component || FindComponentById(componentId)), elementScope = resolveComponent?.FindElementScope(resolveComponent.GetRoot());
        if (!resolveComponent){
            return;
        }
        
        resolveComponent.SetName(name);
        elementScope?.SetLocal('$name', name);
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
