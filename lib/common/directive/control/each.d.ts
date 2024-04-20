import { IProxyAccessHandler, IDirectiveHandlerParams } from "@benbraide/inlinejs";
import { IControlInitInfo } from "./init";
export declare type ListType<T> = Record<string, T> | Array<T>;
export interface EachDirectiveProxyAccessHandlerOptions {
    proxy: object;
    keyName?: string | null;
    valueName?: string | null;
    parent?: IProxyAccessHandler | null;
}
export interface IEachDirectiveEntryOptions<T extends string | number> {
    componentId: string;
    contextElement: HTMLElement;
    keyInCollection: T;
    collection: ListType<any>;
    initInfo: IControlInitInfo;
    key: any;
    keyName?: string | null;
    valueName?: string | null;
}
export declare class EachDirectiveProxyAccessHandler implements IProxyAccessHandler {
    private options_;
    constructor(options_: EachDirectiveProxyAccessHandlerOptions);
    Get(key: string | number, target: object): any;
    Set(key: string | number, value: any, target: object): any;
    GetProxy(): object;
}
export declare class InplaceEachDirectiveProxyAccessHandler implements IProxyAccessHandler {
    private getter_;
    constructor(getCollection: () => ListType<any>, getKeyInCollection: () => string | number, keyName?: string | null, valueName?: string | null);
    Get(key: string | number): any;
}
export declare function UseProxyAccessHandler(componentId: string, handler: IProxyAccessHandler, callback: () => void): void;
export declare class EachDirectiveEntry<T extends string | number> {
    private componentId_;
    private contextElement_;
    private id_;
    private key_;
    private keyInCollection_;
    private getKeyInCollection_;
    private collection_;
    private getCollection_;
    private propKeys_;
    private proxy_;
    private proxyAccessHandler_;
    private cloneElement_;
    private cancelTransition_;
    constructor({ componentId, contextElement, keyInCollection, collection, initInfo, key, keyName, valueName }: IEachDirectiveEntryOptions<T>);
    Update(collection: ListType<any>, key: T, initInfo: IControlInitInfo, updateDomPosition?: boolean): void;
    Destroy(): void;
    GetKey(): any;
}
export declare function LoopDirectiveHandler(matchedExpression: string, keyName: string, valueName: string, { componentId, component, contextElement, expression, ...rest }: IDirectiveHandlerParams): void;
export declare const EachDirectiveHandler: import("@benbraide/inlinejs").IDirectiveHandlerCallbackDetails;
export declare const ForDirectiveHandler: import("@benbraide/inlinejs").IDirectiveHandlerCallbackDetails;
export declare function EachDirectiveHandlerCompact(): void;
