var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { AddDirectiveHandler, CreateDirectiveHandlerCallback, LazyCheck, WaitTransition } from "@benbraide/inlinejs";
export const ShowDirectiveHandler = CreateDirectiveHandlerCallback('show', (_a) => {
    var { componentId, contextElement } = _a, rest = __rest(_a, ["componentId", "contextElement"]);
    let checkpoint = 0, firstEntry = true, lastValue = false, transitionCancel = null, apply = (value) => {
        if (!firstEntry && !!value === lastValue) {
            return;
        }
        const triggerEvent = (visible) => {
            contextElement.dispatchEvent(new CustomEvent('show', {
                detail: { visible }
            }));
        };
        const show = () => {
            if (contextElement.style.length === 1 && contextElement.style.display === 'none') {
                contextElement.removeAttribute('style');
            }
            else {
                contextElement.style.removeProperty('display');
            }
        };
        if (!firstEntry || value) { //Apply applicable transitions if not first entry or value is truthy
            const myCheckpoint = ++checkpoint;
            transitionCancel && transitionCancel();
            !!value && show();
            transitionCancel = WaitTransition({ componentId, contextElement,
                callback: () => {
                    if (myCheckpoint == checkpoint) {
                        !value && (contextElement.style.display = 'none');
                        transitionCancel = null;
                        triggerEvent(!!value);
                    }
                },
                reverse: !value,
            });
        }
        else { //First entry and value is not truthy
            contextElement.style.display = 'none';
        }
        firstEntry = false;
        lastValue = !!value;
    };
    LazyCheck(Object.assign(Object.assign({ componentId, contextElement }, rest), { callback: apply }));
});
export function ShowDirectiveHandlerCompact() {
    AddDirectiveHandler(ShowDirectiveHandler);
}
