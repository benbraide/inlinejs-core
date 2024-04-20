"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitControl = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
function InitControl({ componentId, component, contextElement, expression, originalView }) {
    const resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId));
    if (!resolvedComponent || resolvedComponent.GetRoot() === contextElement) {
        (0, inlinejs_1.JournalError)('Target is component root.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (!(contextElement instanceof HTMLTemplateElement)) {
        (0, inlinejs_1.JournalError)('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    if (contextElement.content.children.length > 1) {
        (0, inlinejs_1.JournalError)('Target must have a single child.', `'${originalView}'.Init`, contextElement);
        return null;
    }
    const evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
    return {
        checkpoint: 0,
        parent: contextElement.parentElement,
        blueprint: contextElement.content.firstElementChild,
        effect: (handler) => (0, inlinejs_1.UseEffect)({ componentId, contextElement,
            callback: () => evaluate(handler),
        }),
        clone: () => contextElement.content.firstElementChild.cloneNode(true),
        getCloneAttributes: () => [...contextElement.content.firstElementChild.attributes],
    };
}
exports.InitControl = InitControl;
