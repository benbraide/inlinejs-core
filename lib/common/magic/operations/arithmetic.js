"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArithmeticMagicHandlerCompact = exports.ArithmeticMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const methods = {
    add: (...values) => values.reduce((acc, value) => (acc + value)),
    subtract: (...values) => values.reduce((acc, value) => (acc - value)),
    multiply: (...values) => values.reduce((acc, value) => (acc * value)),
    divide: (...values) => values.reduce((acc, value) => (acc / value)),
};
let proxy = null;
exports.ArithmeticMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('math', () => (proxy || (proxy = (0, inlinejs_1.CreateReadonlyProxy)(methods))));
function ArithmeticMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ArithmeticMagicHandler);
}
exports.ArithmeticMagicHandlerCompact = ArithmeticMagicHandlerCompact;
