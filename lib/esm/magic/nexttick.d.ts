import { IMagicHandlerParams } from "@benbraide/inlinejs";
export declare function AddNextTickHandler({ componentId, contextElement }: IMagicHandlerParams, callback: (scope: any) => void): void;
export declare const NextTickMagicHandler: import("@benbraide/inlinejs").IMagicHandlerCallbackDetails;
export declare const NextCycleMagicHandler: import("@benbraide/inlinejs").IMagicHandlerCallbackDetails;
export declare function NextTickMagicHandlerCompact(): void;
