import { EvaluateLater, AddMagicHandler, CreateMagicHandlerCallback, GetGlobal } from "@benbraide/inlinejs";
import { ICodeConcept } from "../types";

export const CodeMagicHandler = CreateMagicHandlerCallback('code', ({ componentId, contextElement }) => {
    return (name: string, execute = true, callback?: (value: any) => void) => {
        let expression = (GetGlobal().GetConcept<ICodeConcept>('code')?.FindBlock(name) || '');
        return (execute ? EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: true })(callback) : expression);
    };
});

export function CodeMagicHandlerCompact(){
    AddMagicHandler(CodeMagicHandler);
}
