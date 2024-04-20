"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostDirectiveHandlerCompact = exports.PostDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.PostDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('post', ({ componentId, component, contextElement, expression, argOptions }) => {
    var _a, _b;
    const evaluate = (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression }), options = (0, inlinejs_1.ResolveOptions)({
        options: {
            nexttick: false,
        },
        list: argOptions,
    });
    const nextTick = (options.nexttick ? new inlinejs_1.NextTick(componentId, evaluate, true) : null);
    (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.AddPostProcessCallback(() => (nextTick ? nextTick.Queue() : evaluate()));
});
function PostDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.PostDirectiveHandler);
}
exports.PostDirectiveHandlerCompact = PostDirectiveHandlerCompact;
