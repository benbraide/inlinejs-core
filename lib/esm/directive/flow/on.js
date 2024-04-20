import { AddOutsideEventExcept, AddOutsideEventListener, RemoveOutsideEventListener, FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, ToCamelCase, ResolveOptions, OnDirectiveExpansionRule, GetGlobalScope } from "@benbraide/inlinejs";
import { UseProxyAccessHandler } from "../control/each";
const keyEvents = ['keydown', 'keyup'], mobileMap = {
    click: 'touchend',
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove',
};
function GetOptions(argKey, argOptions) {
    const options = {
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
        state: false,
        debounce: -1,
    };
    const keyOptions = (keyEvents.includes(argKey) ? {
        meta: false,
        alt: false,
        ctrl: false,
        shift: false,
        list: new Array(),
    } : null);
    ResolveOptions({
        options: [options, keyOptions],
        list: argOptions,
        defaultNumber: 250,
        unknownCallback: ({ option }) => {
            if (keyOptions && option) {
                const parts = ((option.length > 1) ? option.split('-') : []);
                if (parts.length == 2 && parts[0].length == 1 && parts[1].length == 1) { //E.g. A-Z
                    const fromCode = parts[0].charCodeAt(0), toCode = parts[1].charCodeAt(0);
                    Array.from({ length: (toCode - fromCode) }).map((i, index) => String.fromCharCode(index + fromCode)).forEach(key => keyOptions.list.push(key));
                }
                else {
                    const mapped = GetGlobal().GetConfig().MapKeyEvent(ToCamelCase(option).toLowerCase());
                    (Array.isArray(mapped) ? mapped : [mapped]).forEach(key => keyOptions.list.push(key));
                }
            }
        },
    });
    return { keyOptions, options };
}
export const OnDirectiveHandler = CreateDirectiveHandlerCallback('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c, _d;
    let checkpoint = 0;
    const evaluate = EvaluateLater({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions);
    const keyStates = (options.state ? GetGlobalScope('keyboardEventStates') : {});
    const activeKeyOptions = Object.entries(keyOptions || {}).filter(([key, value]) => (value === true)).map(([key]) => key), onEvent = (e) => {
        const isKeyboardEvent = (e instanceof KeyboardEvent), isKeyDown = (isKeyboardEvent && options.state && (e.type === 'keydown'));
        isKeyboardEvent && options.state && (keyStates[(e.key || '').toLowerCase()] = isKeyDown);
        if ((options.self && !options.outside && e.target !== contextElement) || activeKeyOptions.findIndex(opt => !e[`${opt}Key`]) != -1) {
            return; //Event is debounced OR event target is not context element OR specified key option is not pressed
        }
        if (isKeyboardEvent) {
            const key = (e.key || '').toLowerCase();
            if (keyOptions && keyOptions.list.length > 0 && keyOptions.list.findIndex(item => (isKeyDown ? !!keyStates[item] : (item === key))) == -1) {
                return; //Key pressed or released doesn't match any specified
            }
        }
        if (!options.outside) {
            options.prevent && e.preventDefault();
            options.once && target.removeEventListener(e.type, onEvent);
            options.stop && e.stopPropagation();
            options.stop && options.immediate && e.stopPropagation();
        }
        if (options.debounce >= 0) { //Debounce for specified duration
            const myCheckpoint = ++checkpoint;
            setTimeout(() => ((myCheckpoint == checkpoint) && handleEvent(e)), (options.debounce || 250));
        }
        else {
            handleEvent(e);
        }
    };
    const handleEvent = (e) => {
        var _a;
        if (options.once) {
            RemoveOutsideEventListener(contextElement, e.type, onEvent);
        }
        if (options.nexttick) {
            (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
        }
        else { //Immediate
            doEvaluation(e);
        }
    };
    const currentProxyAccessHandler = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
    const target = (options.window ? window : (options.document ? globalThis.document : contextElement)), doEvaluation = (e) => {
        const executeEvaluation = () => evaluate(undefined, [e], {
            event: e,
        });
        currentProxyAccessHandler ? UseProxyAccessHandler(componentId, (currentProxyAccessHandler), executeEvaluation) : executeEvaluation();
    };
    if (options.join) {
        argKey = argKey.split('-').join('.');
    }
    else if (options.camel) {
        argKey = ToCamelCase(argKey);
    }
    const mappedEvent = ((options.mobile && argKey in mobileMap) ? mobileMap[argKey] : null);
    if (options.outside && target === contextElement) {
        AddOutsideEventListener(contextElement, argKey, onEvent);
        if (mappedEvent) {
            AddOutsideEventListener(contextElement, mappedEvent, onEvent);
        }
        let elementScope = (_b = (component || FindComponentById(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };
            mappedEvent && (map[mappedEvent] = data);
            AddOutsideEventExcept(contextElement, map, onEvent);
        }), 'outside.event.except');
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => EvaluateLater({ componentId, contextElement, expression })((data) => {
            AddOutsideEventExcept(contextElement, data, onEvent);
        }), 'outside.event.except.map');
    }
    else { //Bind on target
        target.addEventListener(argKey, onEvent, { passive: options.passive });
        if (mappedEvent) {
            target.addEventListener(mappedEvent, onEvent, { passive: options.passive });
        }
        if (target !== contextElement) { //Unbind on destruction
            (_d = (_c = (component || FindComponentById(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent) {
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});
export function OnDirectiveHandlerCompact() {
    AddDirectiveHandler(OnDirectiveHandler);
    GetGlobal().GetDirectiveManager().AddExpansionRule(OnDirectiveExpansionRule);
}
