import { FindComponentById, EvaluateLater, JournalError, UseEffect } from "@benbraide/inlinejs";
export function InitControl({ componentId, component, contextElement, expression, originalView }) {
    if (!contextElement.parentElement) {
        JournalError('Target has no parent.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    const resolvedComponent = (component || FindComponentById(componentId));
    if (!resolvedComponent || resolvedComponent.GetRoot() === contextElement) {
        JournalError('Target is component root.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (!(contextElement instanceof HTMLTemplateElement)) {
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (contextElement.content.children.length > 1) {
        JournalError('Target must have a single child.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    const evaluate = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true }), blueprint = contextElement.content.firstElementChild;
    return {
        checkpoint: 0,
        parent: contextElement.parentElement,
        blueprint: blueprint,
        effect: (handler) => UseEffect({ componentId, contextElement,
            callback: () => evaluate(handler),
        }),
        clone: () => blueprint.cloneNode(true),
        getCloneAttributes: () => [...blueprint.attributes],
    };
}
