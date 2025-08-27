"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticMagicHandlerCompact = exports.StaticMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
let storage_ = null;
exports.StaticMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('static', () => {
    return (value) => {
        (0, inlinejs_1.GetGlobal)().SetCurrentProxyAccessStorage(storage_);
        storage_ = null;
        return value;
    };
}, () => (storage_ = (0, inlinejs_1.GetGlobal)().SetCurrentProxyAccessStorage(null)));
function StaticMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.StaticMagicHandler);
}
exports.StaticMagicHandlerCompact = StaticMagicHandlerCompact;
