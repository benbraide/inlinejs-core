import {
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    UseEffect,
    IsEqual,
    ToString,
    ResolveOptions
} from "@benbraide/inlinejs";

export const ModelDirectiveHandler = CreateDirectiveHandlerCallback('model', ({ componentId, component, contextElement, expression, argOptions }) => {
    const evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            lazy: false,
            number: false,
            forced: false,
            trim: false,
            value: false,
            debounce: -1,
        },
        list: argOptions,
    });

    const transformData = (data: any) => {
        let transformed = (options.number ? parseFloat(ToString(data)) : null);
        return ((transformed || transformed === 0) ? transformed : ((options.number && options.forced) ? 0 : (options.trim ? ToString(data).trim() : data)));
    };

    const evaluateAssignment = (value: any) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${value})`,
        })();
    };

    const getValueExpr = () => 'this.value ? this.value.trim() : \'\'';

    const isRadio = (contextElement instanceof HTMLInputElement && contextElement.type === 'radio');
    const isCheckable = (isRadio || (contextElement instanceof HTMLInputElement && contextElement.type === 'checkbox'));

    let ref: any = null, hotValue = false;
    const assign = () => {
        if (isRadio){
            let transformed = transformData((contextElement as HTMLInputElement).value);
            evaluateAssignment((contextElement as HTMLInputElement).checked ? ((typeof transformed === 'number') ? transformed : getValueExpr()) : '');
        }
        else if (isCheckable){
            if (Array.isArray(ref)){//Add value to array
                let transformed = transformData((contextElement as HTMLInputElement).value), index = ref.indexOf(transformed);
                if (index == -1 && (contextElement as HTMLInputElement).checked){
                    ref.push(transformed);
                }
                else if (index != -1 && !(contextElement as HTMLInputElement).checked){
                    ref.splice(index, 1);
                }
            }
            else{
                evaluateAssignment((contextElement as HTMLInputElement).checked ? 'true' : 'false');
            }
        }
        else if (!options.value && contextElement instanceof HTMLInputElement && contextElement.type === 'file'){
            contextElement.files?.length ? evaluateAssignment(contextElement.multiple ? 'this.files' : 'this.files[0]') : evaluateAssignment('null');
        }
        else if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement){
            let transformed = transformData(contextElement.value);
            evaluateAssignment((typeof transformed === 'number') ? transformed : getValueExpr());
        }
        else if ((contextElement as HTMLSelectElement).multiple){//Retrieve all selected
            let value = Array.from((contextElement as HTMLSelectElement).selectedOptions).map(item => transformData(item.value));
            evaluateAssignment(JSON.stringify(value));
        }
        else{//Single select
            evaluateAssignment(getValueExpr());
        }
    };

    const putValue = (value: any) => {
        if (hotValue){//Ignore changes
            return;
        }

        if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement){
            contextElement.value = ToString(value);
        }
        else if (isRadio){
            (contextElement as HTMLInputElement).checked = IsEqual(transformData(value), transformData((contextElement as HTMLInputElement).value));
        }
        else if (isCheckable){
            if (Array.isArray(value)){//Add value to array
                (contextElement as HTMLInputElement).checked = value.includes(transformData((contextElement as HTMLInputElement).value));
            }
            else{
                (contextElement as HTMLInputElement).checked = !!value;
            }
        }
        else if (contextElement instanceof HTMLSelectElement && contextElement.multiple){//Retrieve all selected
            if (Array.isArray(value)){//Value must be an array
                Array.from((contextElement as HTMLSelectElement).options).forEach(opt => (opt.selected = value.includes(transformData(opt.value))));
            }
        }
        else if (contextElement instanceof HTMLSelectElement){//Single select
            contextElement.value = ToString(value);
        }
    };
    
    let checkpoint = 0;
    const event = ((options.lazy || isCheckable || contextElement instanceof HTMLSelectElement) ? 'change' : 'input'), onEvent = () => {
        if (options.debounce >= 0){//Debounce for specified duration
            let myCheckpoint = ++checkpoint;
            setTimeout(() => ((myCheckpoint == checkpoint) && handleEvent()), (options.debounce || 250));
        }
        else{
            handleEvent();
        }
    };

    const handleEvent = () => {
        assign();
        if (!hotValue){//Prevent infinite update cycles
            hotValue = true;
            FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => (hotValue = false));
        }
    };

    contextElement.addEventListener(event, onEvent);
    if (isRadio && !contextElement.getAttribute('name')){//Set name
        contextElement.setAttribute('name', expression.trim());
    }

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => (ref = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(value => putValue(ref = value)),
    });
});

export function ModelDirectiveHandlerCompact(){
    AddDirectiveHandler(ModelDirectiveHandler);
}
