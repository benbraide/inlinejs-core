"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalsMagicHandlerCompact = exports.LocalsMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.LocalsMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('locals', ({ componentId, component, contextElement }) => {
    var _a, _b;
    return (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.GetLocals();
});
function LocalsMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.LocalsMagicHandler);
}
exports.LocalsMagicHandlerCompact = LocalsMagicHandlerCompact;
