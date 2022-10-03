import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
export const CodeMagicHandler = CreateMagicHandlerCallback('code', ({ componentId, contextElement }) => {
    return (name, execute = true, callback) => {
        var _a;
        let expression = (((_a = GetGlobal().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.FindBlock(name)) || '');
        return (execute ? EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })(callback) : expression);
    };
});
export function CodeMagicHandlerCompact() {
    AddMagicHandler(CodeMagicHandler);
}
