import { AddDirectiveHandler, CreateDirectiveHandlerCallback, StreamData, ToString, LazyCheck } from "@benbraide/inlinejs";

export const TextDirectiveHandler = CreateDirectiveHandlerCallback('text', ({ contextElement, ...rest }) => {
    let checkpoint = 0;
    LazyCheck({ contextElement, ...rest,
        callback: (value) => {
            const myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint == checkpoint){
                    contextElement.textContent = ToString(value);
                }
            });
        },
    });
});

export function TextDirectiveHandlerCompact(){
    AddDirectiveHandler(TextDirectiveHandler);
}
