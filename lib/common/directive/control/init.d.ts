import { IDirectiveHandlerParams } from "@benbraide/inlinejs";
export interface IControlCloneAttribute {
    name: string;
    value: string;
}
export interface IControlInitInfo {
    checkpoint: number;
    parent: HTMLElement;
    blueprint: HTMLElement;
    effect: (handler: (value: any) => void) => void;
    clone: () => HTMLElement;
    getCloneAttributes: () => Array<IControlCloneAttribute>;
}
export declare function InitControl({ componentId, component, contextElement, expression, originalView }: IDirectiveHandlerParams): IControlInitInfo | null;
