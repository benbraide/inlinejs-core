import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, StoreProxyHandler, UseEffect } from "@benbraide/inlinejs";
import { ICodeConcept } from "../types";

export const CodeDirectiveHandler = CreateDirectiveHandlerCallback('code', ({ componentId, contextElement, expression, argKey, originalView }) => {
    if (!(contextElement instanceof HTMLTemplateElement)){
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return;
    }

    expression = expression.trim();
    
    const content = (contextElement.content.textContent || '').trim();
    expression && content && GetGlobal().GetConcept<ICodeConcept>('code')?.AddBlock(expression, content);
    
    if (argKey !== 'tmpl' && argKey !== 'template'){
        const storedProxyHandler = StoreProxyHandler(componentId);
        const evaluate = EvaluateLater({ componentId, contextElement, expression: content, disableFunctionCall: true });
        if (argKey === 'effect'){
            UseEffect({ componentId, contextElement,
                callback: () => evaluate(),
            });
        }
        else{
            storedProxyHandler(() => evaluate());
        }
    }
});

export function CodeDirectiveHandlerCompact(){
    AddDirectiveHandler(CodeDirectiveHandler);
}
