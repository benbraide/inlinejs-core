import { InsertHtml, AddDirectiveHandler, CreateDirectiveHandlerCallback, StreamData, LazyCheck } from "@benbraide/inlinejs";

export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', ({ componentId, contextElement, ...rest }) => {
    let checkpoint = 0;
    LazyCheck({ componentId, contextElement, ...rest,
        callback: (value) => {
            let myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint == checkpoint){
                    InsertHtml({
                        element: contextElement,
                        html: value,
                        component: componentId,
                        processDirectives: true,
                    });
                }
            });
        },
    });
});

export function HtmlDirectiveHandlerCompact(){
    AddDirectiveHandler(HtmlDirectiveHandler);
}
