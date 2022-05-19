import { AddDirectiveHandler } from "@benbraide/inlinejs";
import { CreateSelectionDirectiveHandler } from "./selection";

export const IfDirectiveHandler = CreateSelectionDirectiveHandler(false);

export function IfDirectiveHandlerCompact(){
    AddDirectiveHandler(IfDirectiveHandler);
}
