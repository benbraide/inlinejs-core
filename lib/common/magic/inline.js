"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSMagicHandlerCompact = exports.InlineJSStrMagicHandler = exports.InlineJSVersionMagicHandler = exports.InlineJSValuesMagicHandler = exports.InlineJSUtilitiesMagicHandler = exports.InlineJSGlobalMagicHandler = exports.InlineJSMagicHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.InlineJSMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('inlinejs', () => (globalThis['InlineJS'] || null));
exports.InlineJSGlobalMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('global', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['global']) || null));
exports.InlineJSUtilitiesMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('utilities', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['utilities']) || null));
exports.InlineJSValuesMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('values', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['values']) || null));
exports.InlineJSVersionMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('version', () => ((globalThis['InlineJS'] && globalThis['InlineJS']['version']) || null));
const strProps = {
    convert: (value) => (0, inlinejs_1.ToString)(value),
    camelCase: (value, ucfirst, separator) => (0, inlinejs_1.ToCamelCase)(value, ucfirst, separator),
    snakeCase: (value, separator) => (0, inlinejs_1.ToSnakeCase)(value, separator),
    random: (length = 9) => (0, inlinejs_1.RandomString)(length),
    slug: (value) => (value || '').replace(/[^a-z0-9\s-]/gi, '').replace(/\s+/g, '-').toLowerCase(),
};
let strProxy = null;
exports.InlineJSStrMagicHandler = (0, inlinejs_1.CreateMagicHandlerCallback)('str', () => strProxy = strProxy || (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({
    getter: prop => ((prop && strProps.hasOwnProperty(prop)) ? strProps[prop] : undefined),
    lookup: Object.keys(strProps),
})));
function InlineJSMagicHandlerCompact() {
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSGlobalMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSUtilitiesMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSValuesMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSVersionMagicHandler);
    (0, inlinejs_1.AddMagicHandler)(exports.InlineJSStrMagicHandler);
}
exports.InlineJSMagicHandlerCompact = InlineJSMagicHandlerCompact;
