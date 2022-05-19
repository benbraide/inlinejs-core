import { IDirectiveHandlerParams } from "@benbraide/inlinejs";
export declare function InitControl({ componentId, component, contextElement, expression, originalView }: IDirectiveHandlerParams): {
    checkpoint: number;
    parent: HTMLElement;
    blueprint: HTMLElement;
    effect: (handler: (value: any) => void) => void;
    clone: () => HTMLElement;
} | null;
