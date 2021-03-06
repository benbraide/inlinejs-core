import {
    AddOutsideEventExcept,
    AddOutsideEventListener,
    RemoveOutsideEventListener,
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    GetGlobal,
    ToCamelCase,
    ResolveOptions,
    OnDirectiveExpansionRule
} from "@benbraide/inlinejs";

const keyEvents = ['keydown', 'keyup'], mobileMap = {
    click: 'touchend',
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove',
};

function GetOptions(argKey: string, argOptions: Array<string>){
    let options = {
        outside: false,
        prevent: false,
        stop: false,
        immediate: false,
        once: false,
        document: false,
        window: false,
        self: false,
        passive: false,
        nexttick: false,
        mobile: false,
        join: false,
        camel: false,
        debounce: -1,
    };
    
    let keyOptions = (keyEvents.includes(argKey) ? {
        meta: false,
        alt: false,
        ctrl: false,
        shift: false,
        list: new Array<string | Array<string>>(),
    } : null);

    ResolveOptions({
        options: [options, keyOptions],
        list: argOptions,
        defaultNumber: 250,
        unknownCallback: ({ option }) => {
            if (keyOptions && option){
                let parts = ((option.length > 1) ? option.split('-') : []);
                if (parts.length == 2 && parts[0].length == 1 && parts[1].length == 1){//E.g. A-Z
                    let fromCode = parts[0].charCodeAt(0), toCode = parts[1].charCodeAt(0);
                    keyOptions.list.push(Array.from({ length: (toCode - fromCode) }).map((i, index) => String.fromCharCode(index + fromCode)));
                }
                else{
                    keyOptions.list.push(GetGlobal().GetConfig().MapKeyEvent(ToCamelCase(option).toLowerCase()));
                }
            }
        },
    });

    return { keyOptions, options };
}

export const OnDirectiveHandler = CreateDirectiveHandlerCallback('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions), checkpoint = 0;
    let activeKeyOptions = Object.entries(keyOptions || {}).filter(([key, value]) => (value === true)).map(([key]) => key), onEvent = (e: Event) => {
        if ((options.self && !options.outside && e.target !== contextElement) || activeKeyOptions.findIndex(opt => !e[`${opt}Key`]) != -1){
            return;//Event is debounced OR event target is not context element OR specified key option is not pressed
        }

        if (keyOptions && keyOptions.list.length > 0){
            let key = ((e as KeyboardEvent).key || '').toLowerCase();
            if (keyOptions.list.findIndex(item => (Array.isArray(item) ? item.includes(key) : (item === key))) == -1){
                return;//Key pressed doesn't match any specified
            }
        }

        if (!options.outside){
            options.prevent && e.preventDefault();
            options.once && target.removeEventListener(e.type, onEvent);

            options.stop && e.stopPropagation();
            options.stop && options.immediate && e.stopPropagation();
        }

        if (options.debounce >= 0){//Debounce for specified duration
            let myCheckpoint = ++checkpoint;
            setTimeout(() => ((myCheckpoint == checkpoint) && handleEvent(e)), (options.debounce || 250));
        }
        else{
            handleEvent(e);
        }
    };

    let handleEvent = (e: Event) => {
        if (options.once){
            RemoveOutsideEventListener(contextElement, e.type, <any>onEvent);
        }

        if (options.nexttick){
            FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
        }
        else{//Immediate
            doEvaluation(e);
        }
    };

    let target = (options.window ? window : (options.document ? globalThis.document : contextElement)), doEvaluation = (e: Event) => evaluate(undefined, [e], {
        event: e,
    });

    if (options.join){
        argKey = argKey.split('-').join('.');
    }
    else if (options.camel){
        argKey = ToCamelCase(argKey);
    }

    let mappedEvent = ((options.mobile && argKey in mobileMap) ? <string>mobileMap[argKey] : null);
    if (options.outside && target === contextElement){
        AddOutsideEventListener(contextElement, argKey, <any>onEvent);
        if (mappedEvent){
            AddOutsideEventListener(contextElement, mappedEvent, <any>onEvent);
        }

        let elementScope = (component || FindComponentById(componentId))?.FindElementScope(contextElement);
        elementScope?.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };

            mappedEvent && (map[mappedEvent] = data);
            AddOutsideEventExcept(contextElement, map, <any>onEvent);
        }), 'outside.event.except');

        elementScope?.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            AddOutsideEventExcept(contextElement, data, <any>onEvent);
        }), 'outside.event.except.map');
    }
    else{//Bind on target
        target.addEventListener(argKey, onEvent, { passive: options.passive });
        if (mappedEvent){
            target.addEventListener(mappedEvent, onEvent, { passive: options.passive });
        }

        if (target !== contextElement){//Unbind on destruction
            (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent){
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});

export function OnDirectiveHandlerCompact(){
    AddDirectiveHandler(OnDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
}
