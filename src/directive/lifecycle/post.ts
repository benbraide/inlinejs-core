import { FindComponentById, NextTick, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, ResolveOptions } from "@benbraide/inlinejs";

export const PostDirectiveHandler = CreateDirectiveHandlerCallback('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), options = ResolveOptions({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });

    let nextTick = (options.nexttick ? new NextTick(componentId, evaluate, true) : null);
    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});

export function PostDirectiveHandlerCompact(){
    AddDirectiveHandler(PostDirectiveHandler);
}
