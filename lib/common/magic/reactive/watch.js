"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchMagicHandlerCompact = exports.WatchMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.WatchMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('watch', ({ componentId, contextElement }) => {
    return (expression, callback) => {
        let evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression, disableFunctionCall: true, waitPromise: 'none' }), firstEntry = true, lastValue = null;
        (0, inlinejs_1.UseEffect)({ componentId, contextElement, callback: () => {
                let value = evaluate(), result = null;
                if (!firstEntry && !(0, inlinejs_1.IsEqual)(value, lastValue)) {
                    result = callback(value);
                }
                firstEntry = false;
                lastValue = (0, inlinejs_1.DeepCopy)(value);
                return result;
            } });
    };
});
function WatchMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.WatchMagicHandler);
}
exports.WatchMagicHandlerCompact = WatchMagicHandlerCompact;
