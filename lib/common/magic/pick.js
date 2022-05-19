"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickMagicHandlerCompact = exports.PickMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.PickMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('pick', () => {
    return (pred, trueValue, falseValue) => (!!pred ? trueValue : falseValue);
});
function PickMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.PickMagicHandler);
}
exports.PickMagicHandlerCompact = PickMagicHandlerCompact;
