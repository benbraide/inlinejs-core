import { FindComponentById, CreateDirectiveHandlerCallback, StreamData, JournalError, ISelectionScope, WaitTransition } from "@benbraide/inlinejs";

import { InitControl } from "./init";
import { InsertControlClone } from "./insert";

export function CreateSelectionDirectiveHandler(isElse: boolean){
    return CreateDirectiveHandlerCallback((isElse ? 'else' : 'if'), ({ componentId, component, contextElement, expression, ...rest }) => {
        const resolvedComponent = (component || FindComponentById(componentId)), selectionScopeStackEntry = resolvedComponent?.PeekSelectionScope();
        if (isElse && (!selectionScopeStackEntry?.scope || !selectionScopeStackEntry?.set)){
            return JournalError('Missing matching \'if\' statement.', 'ElseDirectiveHandler', contextElement);
        }

        expression = expression.trim();
        
        let lastValue = false, lastEffectValue: any = null, lastState = (isElse && !!selectionScopeStackEntry?.scope?.state);
        let firstEntry = true, init = InitControl({ componentId, component, contextElement, expression, ...rest });
        if (!init){//Failed to initialize
            return;
        }

        if (!expression && isElse){//Evaluates to true
            init.effect = handler => handler(true);
        }
    
        let clone: HTMLElement | null = null;
        const insert = () => InsertControlClone({ componentId, contextElement,
            parent: init!.parent,
            clone: (clone = init!.clone()),
            relativeType: 'before',
            relative: contextElement,
        });
    
        const remove = () => {
            if (clone && clone.parentElement){//Remove from DOM and destroy scope on next tick
                let cloneCopy: HTMLElement | null = clone;
    
                clone.remove();
                clone = null;
    
                FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => {
                    FindComponentById(componentId)?.FindElementScope(cloneCopy!)?.Destroy();
                    cloneCopy = null;
                });
            }
        };

        let checkpoint = 0, transitionCancel: (() => void) | null = null, effect = (value: any) => {
            let pred = (!!value && !lastState);
            if ((firstEntry && pred) || (pred !== lastValue)){//Apply applicable transitions if not first entry or value is truthy
                let myCheckpoint = ++checkpoint;

                transitionCancel && transitionCancel();
                !!pred && insert();
                
                transitionCancel = WaitTransition({ componentId, contextElement,
                    target: (clone || undefined),
                    callback: () => {
                        if (myCheckpoint == checkpoint){
                            transitionCancel = null;
                            !pred && remove();
                        }
                    },
                    reverse: !pred,
                });
            }
    
            lastEffectValue = value;
            firstEntry = false;
            lastValue = pred;

            if (selectionScope){
                selectionScope.state = (!!value || lastState);
                if (selectionScope.callback){
                    selectionScope.callback(selectionScope.state);
                }
            }
        };
    
        let elementScope = resolvedComponent?.FindElementScope(contextElement), selectionScope: ISelectionScope | null = null;

        elementScope?.AddUninitCallback(remove);
        if (selectionScopeStackEntry){
            if (isElse){//Listen for state change
                selectionScopeStackEntry.scope!.callback = (state) => {
                    lastState = state;
                    effect(lastEffectValue);
                };
            }
            
            if (!isElse || expression){//Create new scope
                selectionScopeStackEntry.scope = (selectionScope = {
                    state: lastState,
                });
                selectionScopeStackEntry.set = true;
            }
        }

        init!.effect((value) => {
            const checkpoint = ++init!.checkpoint;
            StreamData(value, (value) => {
                if (checkpoint == init?.checkpoint){
                    effect(value);
                }
            });
        });
    });
}
