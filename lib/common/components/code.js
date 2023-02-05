"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeElementCompact = exports.CodeElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const evaluate_later_1 = require("@benbraide/inlinejs/lib/common/evaluator/evaluate-later");
const get_1 = require("@benbraide/inlinejs/lib/common/global/get");
const effect_1 = require("@benbraide/inlinejs/lib/common/reactive/effect");
class CodeElement extends inlinejs_element_1.CustomTemplateElement {
    constructor() {
        super({
            mode: 'static',
        });
        this.componentId_ = '';
    }
    OnElementScopeCreated({ componentId }) {
        this.componentId_ = componentId;
        if (this.state_.mode !== 'tmpl' && this.state_.mode !== 'template') {
            let evaluate = (0, evaluate_later_1.EvaluateLater)({ componentId,
                contextElement: this,
                expression: (this.content.textContent || '').trim(),
                disableFunctionCall: true,
            });
            if (this.state_.mode === 'effect') {
                (0, effect_1.UseEffect)({ componentId,
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
        (0, evaluate_later_1.EvaluateLater)({ componentId: this.componentId_,
            contextElement: this,
            expression: (this.content.textContent || '').trim(),
            disableFunctionCall: true,
        })();
    }
}
exports.CodeElement = CodeElement;
function CodeElementCompact() {
    customElements.define((0, get_1.GetGlobal)().GetConfig().GetElementName('code'), CodeElement);
}
exports.CodeElementCompact = CodeElementCompact;
