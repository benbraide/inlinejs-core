import { InsertHtml, AddDirectiveHandler, CreateDirectiveHandlerCallback, StreamData, LazyCheck, StoreProxyHandler, ResolveOptions } from "@benbraide/inlinejs";

export const HtmlDirectiveHandler = CreateDirectiveHandlerCallback('html', ({ componentId, contextElement, argOptions, ...rest }) => {
    let checkpoint = 0;
    const storedProxyHandler = StoreProxyHandler(componentId), options = ResolveOptions({
        options: {
            noremovefalse: false,
            noremovenull: false,
            noremoveundefined: false,
            noinsertfalse: false,
            noinsertnull: false,
            noinsertundefined: false,
        },
        list: argOptions,
    });
    
    LazyCheck({ componentId, contextElement, argOptions, ...rest,
        callback: (value) => {
            const myCheckpoint = ++checkpoint, noRemoveList = new Array<any>(), noInsertList = new Array<any>();
            
            options.noremovefalse && noRemoveList.push(false);
            options.noremovenull && noRemoveList.push(null);
            options.noremoveundefined && noRemoveList.push(undefined);

            options.noinsertfalse && noInsertList.push(false);
            options.noinsertnull && noInsertList.push(null);
            options.noinsertundefined && noInsertList.push(undefined);
            
            StreamData(value, (value) => {
                (myCheckpoint == checkpoint) && storedProxyHandler(() => InsertHtml({
                    element: contextElement,
                    html: value,
                    component: componentId,
                    processDirectives: true,
                    useTransition: true,
                    beforeRemove: noRemoveList.length == 0 ? undefined : beforeTransition => beforeTransition && noRemoveList.includes(value) ? false : undefined,
                    beforeInsert: noInsertList.length == 0 ? undefined : () => noInsertList.includes(value) ? false : undefined,
                }));
            });
        },
    });
});

export function HtmlDirectiveHandlerCompact(){
    AddDirectiveHandler(HtmlDirectiveHandler);
}
