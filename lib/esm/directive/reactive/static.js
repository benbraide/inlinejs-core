import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater } from "@benbraide/inlinejs";
export const StaticDirectiveHandler = CreateDirectiveHandlerCallback('static', ({ componentId, contextElement, expression }) => {
    EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })();
});
export function StaticDirectiveHandlerCompact() {
    AddDirectiveHandler(StaticDirectiveHandler);
}
