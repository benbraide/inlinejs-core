"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalMagicHandlerCompact = exports.RelationalMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const methods = {
    comp: (first, second) => ((first < second) ? -1 : ((first == second) ? 0 : 1)),
    lt: (first, second) => (first < second),
    le: (first, second) => (first <= second),
    eq: (first, second) => (first == second),
    eqs: (first, second) => (first === second),
    nes: (first, second) => (first !== second),
    ne: (first, second) => (first != second),
    ge: (first, second) => (first >= second),
    gt: (first, second) => (first > second),
};
let proxy = null;
exports.RelationalMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('rel', () => (proxy || (proxy = (0, inlinejs_1.CreateReadonlyProxy)(methods))));
function RelationalMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.RelationalMagicHandler);
}
exports.RelationalMagicHandlerCompact = RelationalMagicHandlerCompact;
