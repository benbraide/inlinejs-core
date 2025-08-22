import { FindComponentById, EvaluateLater, JournalError, UseEffect, IDirectiveHandlerParams } from "@benbraide/inlinejs";

export interface IControlCloneAttribute{
    name: string;
    value: string;
}

export interface IControlInitInfo{
    checkpoint: number;
    parent: HTMLElement;
    blueprint: HTMLElement;
    effect: (handler: (value: any) => void) => void;
    clone: () => HTMLElement;
    getCloneAttributes: () => Array<IControlCloneAttribute>;
}

export function InitControl({ componentId, component, contextElement, expression, originalView }: IDirectiveHandlerParams): IControlInitInfo | null{
    if (!contextElement.parentElement){
        JournalError('Target has no parent.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    
    const resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent || resolvedComponent.GetRoot() === contextElement){
        JournalError('Target is component root.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    if (!(contextElement instanceof HTMLTemplateElement)){
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    if (contextElement.content.children.length > 1){
        JournalError('Target must have a single child.', `'${originalView}'.Init`, contextElement);
        return null;
    }

    const evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true }), blueprint = contextElement.content.firstElementChild as HTMLElement;
    return {
        checkpoint: 0,
        parent: contextElement.parentElement,
        blueprint: blueprint,
        effect: (handler: (value: any) => void) => UseEffect({ componentId, contextElement,
            callback: () => evaluate(handler),
        }),
        clone: () => <HTMLElement>blueprint.cloneNode(true),
        getCloneAttributes: () => [...blueprint.attributes],
    };
}
