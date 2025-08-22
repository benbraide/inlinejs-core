import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, UseEffect, IsEqual, ToString, ResolveOptions } from "@benbraide/inlinejs";
export const ModelDirectiveHandler = CreateDirectiveHandlerCallback('model', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
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
    const transformData = (data) => {
        let transformed = (options.number ? parseFloat(ToString(data)) : null);
        return ((transformed || transformed === 0) ? transformed : ((options.number && options.forced) ? 0 : (options.trim ? ToString(data).trim() : data)));
    };
    const evaluateAssignment = (value) => {
        EvaluateLater({ componentId, contextElement,
            expression: `(${expression}) = (${value})`,
        })();
    };
    const getValueExpr = () => 'this.value ? this.value.trim() : \'\'';
    const isRadio = (contextElement instanceof HTMLInputElement && contextElement.type === 'radio');
    const isCheckable = (isRadio || (contextElement instanceof HTMLInputElement && contextElement.type === 'checkbox'));
    let ref = null, hotValue = false;
    const assign = () => {
        var _a;
        if (isRadio) {
            let transformed = transformData(contextElement.value);
            evaluateAssignment(contextElement.checked ? ((typeof transformed === 'number') ? transformed : getValueExpr()) : '');
        }
        else if (isCheckable) {
            if (Array.isArray(ref)) { //Add value to array
                let transformed = transformData(contextElement.value), index = ref.indexOf(transformed);
                if (index == -1 && contextElement.checked) {
                    ref.push(transformed);
                }
                else if (index != -1 && !contextElement.checked) {
                    ref.splice(index, 1);
                }
            }
            else {
                evaluateAssignment(contextElement.checked ? 'true' : 'false');
            }
        }
        else if (!options.value && contextElement instanceof HTMLInputElement && contextElement.type === 'file') {
            ((_a = contextElement.files) === null || _a === void 0 ? void 0 : _a.length) ? evaluateAssignment(contextElement.multiple ? 'this.files' : 'this.files[0]') : evaluateAssignment('null');
        }
        else if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement) {
            let transformed = transformData(contextElement.value);
            evaluateAssignment((typeof transformed === 'number') ? transformed : getValueExpr());
        }
        else if (contextElement.multiple) { //Retrieve all selected
            let value = Array.from(contextElement.selectedOptions).map(item => transformData(item.value));
            evaluateAssignment(JSON.stringify(value));
        }
        else { //Single select
            evaluateAssignment(getValueExpr());
        }
    };
    const putValue = (value) => {
        if (hotValue) { //Ignore changes
            return;
        }
        if (contextElement instanceof HTMLInputElement || contextElement instanceof HTMLTextAreaElement) {
            contextElement.value = ToString(value);
        }
        else if (isRadio) {
            contextElement.checked = IsEqual(transformData(value), transformData(contextElement.value));
        }
        else if (isCheckable) {
            if (Array.isArray(value)) { //Add value to array
                contextElement.checked = value.includes(transformData(contextElement.value));
            }
            else {
                contextElement.checked = !!value;
            }
        }
        else if (contextElement instanceof HTMLSelectElement && contextElement.multiple) { //Retrieve all selected
            if (Array.isArray(value)) { //Value must be an array
                Array.from(contextElement.options).forEach(opt => (opt.selected = value.includes(transformData(opt.value))));
            }
        }
        else if (contextElement instanceof HTMLSelectElement) { //Single select
            contextElement.value = ToString(value);
        }
    };
    let checkpoint = 0;
    const event = ((options.lazy || isCheckable || contextElement instanceof HTMLSelectElement) ? 'change' : 'input'), onEvent = () => {
        if (options.debounce >= 0) { //Debounce for specified duration
            let myCheckpoint = ++checkpoint;
            setTimeout(() => ((myCheckpoint == checkpoint) && handleEvent()), (options.debounce || 250));
        }
        else {
            handleEvent();
        }
    };
    const handleEvent = () => {
        var _a;
        assign();
        if (!hotValue) { //Prevent infinite update cycles
            hotValue = true;
            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => (hotValue = false));
        }
    };
    contextElement.addEventListener(event, onEvent);
    if (isRadio && !contextElement.getAttribute('name')) { //Set name
        contextElement.setAttribute('name', expression.trim());
    }
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddUninitCallback(() => (ref = null));
    UseEffect({ componentId, contextElement,
        callback: () => evaluate(value => putValue(ref = value)),
    });
});
export function ModelDirectiveHandlerCompact() {
    AddDirectiveHandler(ModelDirectiveHandler);
}
