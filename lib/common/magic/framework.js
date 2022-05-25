"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkMagicHandlerCompact = exports.FrameworkMagicHandler = void 0;
let getPackageVersion = require('@jsbits/get-package-version');
const inlinejs_1 = require("@benbraide/inlinejs");
const FrameworkProps = {
    version: () => getPackageVersion('../../'),
};
const FrameworkProxy = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({
    getter: (prop) => ((prop && FrameworkProps.hasOwnProperty(prop)) ? FrameworkProps[prop]() : undefined),
    lookup: Object.keys(FrameworkProps),
}));
exports.FrameworkMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('framework', () => FrameworkProxy);
function FrameworkMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.FrameworkMagicHandler);
}
exports.FrameworkMagicHandlerCompact = FrameworkMagicHandlerCompact;
