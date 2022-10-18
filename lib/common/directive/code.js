"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeDirectiveHandlerCompact = exports.CodeDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.CodeDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('code', ({ componentId, contextElement, expression, argKey, originalView }) => {
    var _a;
    if (!(contextElement instanceof HTMLTemplateElement)) {
        (0, inlinejs_1.JournalError)('Target is not a template element.', `'${originalView}'.Init`, contextElement);
        return;
    }
    expression = expression.trim();
    let content = (contextElement.content.textContent || '').trim();
    expression && content && ((_a = (0, inlinejs_1.GetGlobal)().GetConcept('code')) === null || _a === void 0 ? void 0 : _a.AddBlock(expression, content));
    if (argKey !== 'tmpl' && argKey !== 'template') {
        let evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression: content, disableFunctionCall: true });
        if (argKey === 'effect') {
            (0, inlinejs_1.UseEffect)({ componentId, contextElement,
                callback: () => evaluate(),
            });
        }
        else {
            evaluate();
        }
    }
});
function CodeDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.CodeDirectiveHandler);
}
exports.CodeDirectiveHandlerCompact = CodeDirectiveHandlerCompact;
