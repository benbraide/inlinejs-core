import { AddDirectiveHandler, CreateDirectiveHandlerCallback, FindComponentById } from "@benbraide/inlinejs";

export const LogDirectiveHandler = CreateDirectiveHandlerCallback('log', ({ componentId, component, contextElement }) => {
    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddPostProcessCallback(() => console.log(contextElement));
});

export function LogDirectiveHandlerCompact(){
    AddDirectiveHandler(LogDirectiveHandler);
}
