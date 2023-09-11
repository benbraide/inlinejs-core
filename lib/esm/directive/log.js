import { AddDirectiveHandler, CreateDirectiveHandlerCallback, FindComponentById } from "@benbraide/inlinejs";
export const LogDirectiveHandler = CreateDirectiveHandlerCallback('log', ({ componentId, component, contextElement }) => {
    var _a, _b;
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => console.log(contextElement));
});
export function LogDirectiveHandlerCompact() {
    AddDirectiveHandler(LogDirectiveHandler);
}
