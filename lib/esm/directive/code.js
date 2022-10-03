import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, GetGlobal } from "@benbraide/inlinejs";
export const CodeDirectiveHandler = CreateDirectiveHandlerCallback('code', ({ componentId, contextElement, expression, argKey }) => {
    var _a;
    let content = (contextElement.textContent || '').trim();
    contextElement.textContent && ((_a = GetGlobal().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(expression, content));
    (argKey === 'execute') && EvaluateLater({ componentId, contextElement, expression: content, disableFunctionCall: true })();
});
export function CodeDirectiveHandlerCompact() {
    AddDirectiveHandler(CodeDirectiveHandler);
}
