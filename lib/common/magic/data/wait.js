"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitMagicHandlerCompact = exports.WaitMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.WaitMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('wait', () => {
    return (value, callback) => (0, inlinejs_1.WaitPromise)(value, value => (0, inlinejs_1.WaitWhile)(value, callback, callback));
});
function WaitMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.WaitMagicHandler);
}
exports.WaitMagicHandlerCompact = WaitMagicHandlerCompact;
