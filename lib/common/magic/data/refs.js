"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefsMagicHandlerCompact = exports.RefsMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.RefsMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('refs', ({ componentId, component }) => {
    const resolvedComponent = (component || (0, inlinejs_1.FindComponentById)(componentId));
    return (resolvedComponent ? (0, inlinejs_1.CreateReadonlyProxy)(resolvedComponent.GetRefElements()) : null);
});
function RefsMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.RefsMagicHandler);
}
exports.RefsMagicHandlerCompact = RefsMagicHandlerCompact;
