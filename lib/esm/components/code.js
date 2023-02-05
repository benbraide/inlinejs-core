import { CustomTemplateElement } from "@benbraide/inlinejs-element";
import { EvaluateLater } from "@benbraide/inlinejs/lib/common/evaluator/evaluate-later";
import { GetGlobal } from "@benbraide/inlinejs/lib/common/global/get";
import { UseEffect } from "@benbraide/inlinejs/lib/common/reactive/effect";
export class CodeElement extends CustomTemplateElement {
    constructor() {
        super({
            mode: 'static',
        });
        this.componentId_ = '';
    }
    OnElementScopeCreated({ componentId }) {
        this.componentId_ = componentId;
        if (this.state_.mode !== 'tmpl' && this.state_.mode !== 'template') {
            let evaluate = EvaluateLater({ componentId,
                contextElement: this,
                expression: (this.content.textContent || '').trim(),
                disableFunctionCall: true,
            });
            if (this.state_.mode === 'effect') {
                UseEffect({ componentId,
                    contextElement: this,
                    callback: () => evaluate(),
                });
            }
            else {
                evaluate();
            }
        }
    }
    GetContent() {
        return (this.content.textContent || '');
    }
    Evaluate() {
        EvaluateLater({ componentId: this.componentId_,
            contextElement: this,
            expression: (this.content.textContent || '').trim(),
            disableFunctionCall: true,
        })();
    }
}
export function CodeElementCompact() {
    customElements.define(GetGlobal().GetConfig().GetElementName('code'), CodeElement);
}
