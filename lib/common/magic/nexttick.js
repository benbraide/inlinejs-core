"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextTickMagicHandlerCompact = exports.NextTickMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.NextTickMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('nextTick', ({ componentId }) => {
    return (callback) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(callback); };
});
function NextTickMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.NextTickMagicHandler);
}
exports.NextTickMagicHandlerCompact = NextTickMagicHandlerCompact;
