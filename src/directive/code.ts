import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError } from "@benbraide/inlinejs";
import { ICodeConcept } from "../types";

export const CodeDirectiveHandler = CreateDirectiveHandlerCallback('code', ({ componentId, contextElement, expression, argKey, originalView }) => {
    if (!(contextElement instanceof HTMLTemplateElement)){
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return;
    }

    expression = expression.trim();
    
    let content = (contextElement.content.textContent || '').trim();
    expression && content && GetGlobal().GetConcept<ICodeConcept>('code')?.AddBlock(expression, content);
    
    (argKey !== 'tmpl' && argKey !== 'template') && EvaluateLater({ componentId, contextElement, expression: content, disableFunctionCall: true })();
});

export function CodeDirectiveHandlerCompact(){
    AddDirectiveHandler(CodeDirectiveHandler);
}
