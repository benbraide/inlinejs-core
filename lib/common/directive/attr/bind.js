"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindDirectiveHandlerCompact = exports.BindDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
exports.BindDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('bind', ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    var _a, _b;
    argKey = argKey.trim();
    if (argKey === 'key') {
        return (_b = (_a = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _a === void 0 ? void 0 : _a.FindElementScope(contextElement)) === null || _b === void 0 ? void 0 : _b.SetKey(expression);
    }
    let options = (0, inlinejs_1.ResolveOptions)({ options: { camel: false }, list: argOptions });
    (0, inlinejs_1.ResolveKeyValue)({ componentId, contextElement, expression,
        key: argKey,
        callback: ([key, value]) => {
            key = (options.camel ? (0, inlinejs_1.ToCamelCase)(key) : key);
            let isBoolean = (0, inlinejs_1.IsBooleanAttribute)(contextElement, key);
            if (value || ((value === 0 || value === '') && !isBoolean)) { //Set
                contextElement.setAttribute(key, (isBoolean ? key : (0, inlinejs_1.ToString)(value)));
            }
            else { //Remove
                contextElement.removeAttribute(key);
            }
        },
    });
});
function BindDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.BindDirectiveHandler);
    (0, inlinejs_1.GetGlobal)().GetDirectiveManager().AddExpansionRule(inlinejs_1.BindDirectiveExpansionRule);
}
exports.BindDirectiveHandlerCompact = BindDirectiveHandlerCompact;
