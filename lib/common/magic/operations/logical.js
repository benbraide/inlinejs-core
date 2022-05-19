"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalMagicHandlerCompact = exports.LogicalMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const methods = {
    or: (...values) => values.at(values.findIndex(value => !!value)),
    and: (...values) => values.at(values.findIndex(value => !value)),
};
let proxy = null;
exports.LogicalMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('log', () => (proxy || (proxy = (0, inlinejs_1.CreateReadonlyProxy)(methods))));
function LogicalMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.LogicalMagicHandler);
}
exports.LogicalMagicHandlerCompact = LogicalMagicHandlerCompact;
