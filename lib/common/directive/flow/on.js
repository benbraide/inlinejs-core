"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDirectiveHandlerCompact = exports.OnDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const each_1 = require("../control/each");
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
    (0, inlinejs_1.ResolveOptions)({
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
                    const mapped = (0, inlinejs_1.GetGlobal)().GetConfig().MapKeyEvent((0, inlinejs_1.ToCamelCase)(option).toLowerCase());
                    (Array.isArray(mapped) ? mapped : [mapped]).forEach(key => keyOptions.list.push(key));
                }
            }
        },
    });
    return { keyOptions, options };
}
exports.OnDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('on', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b, _c, _d;
    let checkpoint = 0;
    const evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression }), { keyOptions, options } = GetOptions(argKey, argOptions);
    const keyStates = (options.state ? (0, inlinejs_1.GetGlobalScope)('keyboardEventStates') : {});
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
            (0, inlinejs_1.RemoveOutsideEventListener)(contextElement, e.type, onEvent);
        }
        if (options.nexttick) {
            (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => doEvaluation(e));
        }
        else { //Immediate
            doEvaluation(e);
        }
    };
    const currentProxyAccessHandler = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetProxyAccessHandler();
    const target = (options.window ? window : (options.document ? globalThis.document : contextElement)), doEvaluation = (e) => {
        const executeEvaluation = () => evaluate(undefined, [e], {
            event: e,
        });
        currentProxyAccessHandler ? (0, each_1.UseProxyAccessHandler)(componentId, (currentProxyAccessHandler), executeEvaluation) : executeEvaluation();
    };
    if (options.join) {
        argKey = argKey.split('-').join('.');
    }
    else if (options.camel) {
        argKey = (0, inlinejs_1.ToCamelCase)(argKey);
    }
    const mappedEvent = ((options.mobile && argKey in mobileMap) ? mobileMap[argKey] : null);
    if (options.outside && target === contextElement) {
        (0, inlinejs_1.AddOutsideEventListener)(contextElement, argKey, onEvent);
        if (mappedEvent) {
            (0, inlinejs_1.AddOutsideEventListener)(contextElement, mappedEvent, onEvent);
        }
        let elementScope = (_b = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
            let map = {
                [argKey]: data,
            };
            mappedEvent && (map[mappedEvent] = data);
            (0, inlinejs_1.AddOutsideEventExcept)(contextElement, map, onEvent);
        }), 'outside.event.except');
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.GetDirectiveManager().AddHandler(({ expression }) => (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression })((data) => {
            (0, inlinejs_1.AddOutsideEventExcept)(contextElement, data, onEvent);
        }), 'outside.event.except.map');
    }
    else { //Bind on target
        target.addEventListener(argKey, onEvent, { passive: options.passive });
        if (mappedEvent) {
            target.addEventListener(mappedEvent, onEvent, { passive: options.passive });
        }
        if (target !== contextElement) { //Unbind on destruction
            (_d = (_c = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _c === void 0 ? void 0 : _c.FindElementScope(contextElement)) === null || _d === void 0 ? void 0 : _d.AddUninitCallback(() => {
                target.removeEventListener(argKey, onEvent);
                if (mappedEvent) {
                    target.removeEventListener(mappedEvent, onEvent);
                }
            });
        }
    }
});
function OnDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.OnDirectiveHandler);
    (0, inlinejs_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(inlinejs_1.OnDirectiveExpansionRule);
}
exports.OnDirectiveHandlerCompact = OnDirectiveHandlerCompact;
