"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentMagicHandlerCompact = exports.ComponentNameMagicHandler = exports.ComponentByIdMagicHandler = exports.ComponentMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.ComponentMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('component', () => (name) => { var _a; return (_a = (0, inlinejs_1.FindComponentByName)(name)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative(); });
exports.ComponentByIdMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('componentById', () => (id) => { var _a; return (_a = (0, inlinejs_1.FindComponentById)(id)) === null || _a === void 0 ? void 0 : _a.GetRootProxy().GetNative(); });
exports.ComponentNameMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('name', ({ componentId, component }) => { var _a; return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetName(); });
function ComponentMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.ComponentMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.ComponentByIdMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.ComponentNameMagicHandler);
}
exports.ComponentMagicHandlerCompact = ComponentMagicHandlerCompact;
