"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsMagicHandlerCompact = exports.GetLocalMagicHandler = exports.LocalsMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.LocalsMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('locals', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetLocals();
});
exports.GetLocalMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('getLocal', ({ componentId, contextElement }) => {
    return (name) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementLocalValue(contextElement, name, true); };
});
function LocalsMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.LocalsMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.GetLocalMagicHandler);
}
exports.LocalsMagicHandlerCompact = LocalsMagicHandlerCompact;
