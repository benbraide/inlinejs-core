import {
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    StreamData,
    ToString,
    LazyCheck,
    GetGlobal,
    UseRange,
    ResolveOptions,
    ConsiderRange
} from "@benbraide/inlinejs";

export const TextDirectiveHandler = CreateDirectiveHandlerCallback('text', ({ contextElement, argOptions, ...rest }) => {
    const options = ResolveOptions({
        options: {
            floatRange: false,
        },
        list: argOptions,
    });
    
    let checkpoint = 0, rangeCheckpoint = 0;
    LazyCheck({ contextElement, argOptions, ...rest,
        callback: (value) => {
            const myCheckpoint = ++checkpoint;
            StreamData(value, (value) => {
                if (myCheckpoint !== checkpoint) return;

                const myRangeCheckpoint = ++rangeCheckpoint;
                ConsiderRange(value, (value) => {
                    if (myCheckpoint !== checkpoint || myRangeCheckpoint !== rangeCheckpoint) return false;
                    contextElement.textContent = ToString(value);
                }, 3000, 1000, !options.floatRange);
            });
        },
    });
});

export function TextDirectiveHandlerCompact(){
    AddDirectiveHandler(TextDirectiveHandler);
}
