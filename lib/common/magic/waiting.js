"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingMagicHandlerCompact = exports.WaitingMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.WaitingMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('waiting', () => {
    return (value) => {
        if (value instanceof Promise) {
            return new Promise((resolve, reject) => {
                value.then(() => resolve(false)).catch(reject);
            });
        }
        if (value instanceof inlinejs_1.Loop) {
            return new Promise((resolve) => {
                value.Final(() => resolve(false));
            });
        }
        return false;
    };
});
function WaitingMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.WaitingMagicHandler);
}
exports.WaitingMagicHandlerCompact = WaitingMagicHandlerCompact;
