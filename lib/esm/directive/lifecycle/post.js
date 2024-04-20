import { FindComponentById, NextTick, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ResolveOptions } from "@benbraide/inlinejs";
export const PostDirectiveHandler = CreateDirectiveHandlerCallback('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    const evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });
    const nextTick = (options.nexttick ? new NextTick(componentId, evaluate, true) : null);
    (_b = (_a = (component || FindComponentById(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});
export function PostDirectiveHandlerCompact() {
    AddDirectiveHandler(PostDirectiveHandler);
}
