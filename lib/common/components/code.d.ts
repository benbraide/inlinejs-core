import { CustomTemplateElement } from "@benbraide/inlinejs-element";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs/lib/common/types/component";
export declare class CodeElement extends CustomTemplateElement {
    private componentId_;
    constructor();
    OnElementScopeCreated({ componentId }: IElementScopeCreatedCallbackParams): void;
    GetContent(): string;
    Evaluate(): void;
}
export declare function CodeElementCompact(): void;
