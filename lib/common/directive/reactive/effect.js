"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffectDirectiveHandlerCompact = exports.EffectDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.EffectDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('effect', ({ componentId, contextElement, expression }) => {
    const evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true });
    (0, inlinejs_1.UseEffect)({ componentId, contextElement,
        callback: () => evaluate(),
    });
});
function EffectDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.EffectDirectiveHandler);
}
exports.EffectDirectiveHandlerCompact = EffectDirectiveHandlerCompact;
