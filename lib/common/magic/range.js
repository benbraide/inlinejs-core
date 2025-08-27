"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RangeMagicHandlerCompact = exports.RangeMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.RangeMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('range', () => {
    return (from, to, duration = 0, delay = 0) => {
        return duration > 0 ? (0, inlinejs_1.GetGlobal)().CreateTimedRange(from, to, duration, delay) : (0, inlinejs_1.GetGlobal)().CreateRange(from, to);
    };
});
function RangeMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.RangeMagicHandler);
}
exports.RangeMagicHandlerCompact = RangeMagicHandlerCompact;
