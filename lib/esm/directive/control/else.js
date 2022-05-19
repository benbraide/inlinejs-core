import { AddDirectiveHandler } from "@benbraide/inlinejs";
import { CreateSelectionDirectiveHandler } from "./selection";
export const ElseDirectiveHandler = CreateSelectionDirectiveHandler(true);
export function ElseDirectiveHandlerCompact() {
    AddDirectiveHandler(ElseDirectiveHandler);
}
