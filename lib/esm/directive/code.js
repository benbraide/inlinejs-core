import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal, JournalError, UseEffect } from "@benbraide/inlinejs";
export const CodeDirectiveHandler = CreateDirectiveHandlerCallback('code', ({ componentId, contextElement, expression, argKey, originalView }) => {
    var _a;
    if (!(contextElement instanceof HTMLTemplateElement)) {
        JournalError('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return;
    }
    expression = expression.trim();
    let content = (contextElement.content.textContent || '').trim();
    expression && content && ((_a = GetGlobal().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(expression, content));
    if (argKey !== 'tmpl' && argKey !== 'template') {
        let evaluate = EvaluateLater({ componentId, contextElement, expression: content, disableFunctionCall: true });
        if (argKey === 'effect') {
            UseEffect({ componentId, contextElement,
                callback: () => evaluate(),
            });
        }
        else {
            evaluate();
        }
    }
});
export function CodeDirectiveHandlerCompact() {
    AddDirectiveHandler(CodeDirectiveHandler);
}
