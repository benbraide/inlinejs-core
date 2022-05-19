"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamMagicHandlerCompact = exports.StreamMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StreamMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('stream', () => {
    return (value, callback) => (0, inlinejs_1.StreamData)(value, callback);
});
function StreamMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.StreamMagicHandler);
}
exports.StreamMagicHandlerCompact = StreamMagicHandlerCompact;
