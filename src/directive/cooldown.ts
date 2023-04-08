import { AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, FindComponentById } from "@benbraide/inlinejs";

enum CooldownType{
    tick,
    idle,
    nonIdle,
}

function CreateCooldownHandlerCallback(name: string, type: CooldownType){
    return CreateDirectiveHandlerCallback(name, ({ componentId, contextElement, expression }) => {
        const evaluateLater = EvaluateLater({ componentId, contextElement, expression, disableFunctionCall: false });

        let binder: () => void, handler = () => {
            binder();
            evaluateLater();
        };

        if (type === CooldownType.idle){
            binder = () => FindComponentById(componentId)?.GetBackend().changes.AddNextIdleHandler(handler);
        }
        else if (type === CooldownType.nonIdle){
            binder = () => FindComponentById(componentId)?.GetBackend().changes.AddNextNonIdleHandler(handler);
        }
        else{
            binder = () => FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(handler);
        }

        binder();
    });
}

export const NextTickDirectiveHandler = CreateCooldownHandlerCallback('next-tick', CooldownType.tick);
export const NextIdleDirectiveHandler = CreateCooldownHandlerCallback('next-idle', CooldownType.idle);
export const NextNonIdleDirectiveHandler = CreateCooldownHandlerCallback('next-non-idle', CooldownType.nonIdle);

export function CooldownDirectiveHandlerCompact(){
    AddDirectiveHandler(NextTickDirectiveHandler);
    AddDirectiveHandler(NextIdleDirectiveHandler);
    AddDirectiveHandler(NextNonIdleDirectiveHandler);
}
