import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal } from "@benbraide/inlinejs";
import { ICodeConcept } from "../types";

export const CodeDirectiveHandler = CreateDirectiveHandlerCallback('code', ({ componentId, contextElement, expression, argKey }) => {
    let content = (contextElement.textContent || '').trim();
    contextElement.textContent && GetGlobal().GetConcept<ICodeConcept>('code')?.AddBlock(expression, content);
    (argKey === 'execute') && EvaluateLater({ componentId, contextElement, expression: content, disableFunctionCall: true })();
});

export function CodeDirectiveHandlerCompact(){
    AddDirectiveHandler(CodeDirectiveHandler);
}
