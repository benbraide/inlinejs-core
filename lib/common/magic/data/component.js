"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentMagicHandlerCompact = exports.ComponentNameMagicHandler = exports.ComponentMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ComponentMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('component', () => (name) => { var _a; return (_a = ((0, inlinejs_1.FindComponentByName)(name) || (0, inlinejs_1.FindComponentById)(name))) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative(); });
exports.ComponentNameMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('name', ({ componentId, component }) => { var _a; return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetName(); });
function ComponentMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ComponentMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.ComponentNameMagicHandler);
}
exports.ComponentMagicHandlerCompact = ComponentMagicHandlerCompact;
