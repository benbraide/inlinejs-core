import { CustomTemplateElement } from "@benbraide/inlinejs-element"
import { EvaluateLater } from "@benbraide/inlinejs/lib/common/evaluator/evaluate-later";
import { GetGlobal } from "@benbraide/inlinejs/lib/common/global/get";
import { UseEffect } from "@benbraide/inlinejs/lib/common/reactive/effect";
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs/lib/common/types/component";

export class CodeElement extends CustomTemplateElement{
    private componentId_ = '';
    
    public constructor(){
        super({
            mode: 'static',
        });
    }

    public OnElementScopeCreated({ componentId }: IElementScopeCreatedCallbackParams){
        this.componentId_ = componentId;
        if (this.state_.mode !== 'tmpl' && this.state_.mode !== 'template'){
            let evaluate = EvaluateLater({ componentId,
                contextElement: this,
                expression: (this.content.textContent || '').trim(),
                disableFunctionCall: true,
            });

            if (this.state_.mode === 'effect'){
                UseEffect({ componentId,
                    contextElement: this,
                    callback: () => evaluate(),
                });
            }
            else{
                evaluate();
            }
        }
    }

    public GetContent(){
        return (this.content.textContent || '');
    }

    public Evaluate(){
        EvaluateLater({ componentId: this.componentId_,
            contextElement: this,
            expression: (this.content.textContent || '').trim(),
            disableFunctionCall: true,
        })();
    }
}

export function CodeElementCompact(){
    customElements.define(GetGlobal().GetConfig().GetElementName('code'), CodeElement);
}
