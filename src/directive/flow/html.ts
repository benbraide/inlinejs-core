import { InsertHtml, AddDirectiveHandler, CreateDirectiveHandlerCallback, StreamData, LazyCheck, StoreProxyHandler } from "@benbraide/inlinejs";

export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', ({ componentId, contextElement, ...rest }) => {
    let checkpoint = 0;
    const storedProxyHandler = StoreProxyHandler(componentId);
    
    LazyCheck({ componentId, contextElement, ...rest,
        callback: (value) => {
            const myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                (myCheckpoint == checkpoint) && storedProxyHandler(() => InsertHtml({
                    element: contextElement,
                    html: value,
                    component: componentId,
                    processDirectives: true,
                    afterTransitionCallback: () => {},
                }));
            });
        },
    });
});

export function HtmlDirectiveHandlerCompact(){
    AddDirectiveHandler(HtmlDirectiveHandler);
}
