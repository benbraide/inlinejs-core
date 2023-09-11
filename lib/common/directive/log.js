"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogDirectiveHandlerCompact = exports.LogDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.LogDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('log', ({ componentId, component, contextElement }) => {
    var _a, _b;
    (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => console.log(contextElement));
});
function LogDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.LogDirectiveHandler);
}
exports.LogDirectiveHandlerCompact = LogDirectiveHandlerCompact;
