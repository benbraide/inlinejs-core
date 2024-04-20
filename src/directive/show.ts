import { AddDirectiveHandler, CreateDirectiveHandlerCallback, LazyCheck, WaitTransition } from "@benbraide/inlinejs";

export const ShowDirectiveHandler = CreateDirectiveHandlerCallback('show', ({ componentId, contextElement, ...rest }) => {
    let checkpoint = 0, firstEntry = true, lastValue = false, transitionCancel: (() => void) | null = null, apply = (value: any) => {
        if (!firstEntry && !!value === lastValue){
            return;
        }

        const triggerEvent = (visible: boolean) => {
            contextElement.dispatchEvent(new CustomEvent('show', {
                detail: { visible }
            }));
        };

        const show = () => {
            if (contextElement.style.length === 1 && contextElement.style.display === 'none') {
                contextElement.removeAttribute('style');
            }
            else{
                contextElement.style.removeProperty('display');
            }
        };

        if (!firstEntry || value){//Apply applicable transitions if not first entry or value is truthy
            const myCheckpoint = ++checkpoint;

            transitionCancel && transitionCancel();
            !!value && show();
            
            transitionCancel = WaitTransition({ componentId, contextElement,
                callback: () => {
                    if (myCheckpoint == checkpoint){
                        !value && (contextElement.style.display = 'none');
                        transitionCancel = null;
                        triggerEvent(!!value);
                    }
                },
                reverse: !value,
            });
        }
        else{//First entry and value is not truthy
            contextElement.style.display = 'none';
        }

        firstEntry = false;
        lastValue = !!value;
    };

    LazyCheck({ componentId, contextElement, ...rest,
        callback: apply,
    });
});

export function ShowDirectiveHandlerCompact(){
    AddDirectiveHandler(ShowDirectiveHandler);
}
