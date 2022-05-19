import { AddDirectiveHandler, CreateDirectiveHandlerCallback } from "@benbraide/inlinejs";

export const CloakDirectiveHandler = CreateDirectiveHandlerCallback('cloak', () => {});

export function CloakDirectiveHandlerCompact(){
    AddDirectiveHandler(CloakDirectiveHandler);
}
