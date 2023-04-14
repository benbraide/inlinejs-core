"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreMagicHandlerCompact = exports.StoreMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.StoreMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('store', ({ componentId, contextElement }) => {
    return (value, useLocal = false) => {
        return (0, inlinejs_1.GetGlobal)().StoreObject({
            object: value,
            componentId: (useLocal ? componentId : undefined),
            contextElement: (useLocal ? contextElement : undefined),
        });
    };
});
function StoreMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.StoreMagicHandler);
}
exports.StoreMagicHandlerCompact = StoreMagicHandlerCompact;
