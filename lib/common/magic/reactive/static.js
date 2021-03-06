"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticMagicHandlerCompact = exports.StaticMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StaticMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('static', ({ componentId }) => {
    return (value) => {
        var _a;
        (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        return value;
    };
}, ({ componentId, component }) => { var _a; return (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.PushGetAccessStorageSnapshot(); });
function StaticMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.StaticMagicHandler);
}
exports.StaticMagicHandlerCompact = StaticMagicHandlerCompact;
