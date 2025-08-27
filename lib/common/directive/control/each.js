"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EachDirectiveHandlerCompact = exports.ForDirectiveHandler = exports.EachDirectiveHandler = exports.LoopDirectiveHandler = exports.EachDirectiveEntry = exports.UseProxyAccessHandler = exports.InplaceEachDirectiveProxyAccessHandler = exports.EachDirectiveProxyAccessHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const init_1 = require("./init");
const insert_1 = require("./insert");
class EachDirectiveProxyAccessHandler {
    constructor(options_) {
        this.options_ = options_;
    }
    Get(key, target) {
        if (key === '$each') {
            return this.options_.proxy;
        }
        if (this.options_.keyName && key === this.options_.keyName) {
            return this.options_.proxy['index'];
        }
        if (this.options_.valueName && key === this.options_.valueName) {
            return this.options_.proxy['value'];
        }
        return ((this.options_.parent && this.options_.parent.Get) ? this.options_.parent.Get(key, target) : (0, inlinejs_1.GetGlobal)().CreateNothing());
    }
    Set(key, value, target) {
        if (this.options_.valueName && key === this.options_.valueName) {
            return (this.options_.proxy['value'] = value);
        }
        return ((this.options_.parent && this.options_.parent.Set) ? this.options_.parent.Set(key, value, target) : (0, inlinejs_1.GetGlobal)().CreateNothing());
    }
    GetProxy() {
        return this.options_.proxy;
    }
}
exports.EachDirectiveProxyAccessHandler = EachDirectiveProxyAccessHandler;
class InplaceEachDirectiveProxyAccessHandler {
    constructor(getCollection, getKeyInCollection, keyName, valueName) {
        const getCount = (list) => (Array.isArray(list) ? list.length : Object.keys(list).length), props = {
            collection: getCollection,
            count: () => getCount(getCollection()),
            index: getKeyInCollection,
            value: () => getCollection()[getKeyInCollection()],
        };
        const proxy = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({ getter: (prop) => {
                if (prop && props.hasOwnProperty(prop)) {
                    return props[prop]();
                }
            }, lookup: Object.keys(props) }));
        this.getter_ = (key) => {
            if (key === '$each') {
                return proxy;
            }
            if (keyName && key === keyName) {
                return proxy['index'];
            }
            if (valueName && key === valueName) {
                return proxy['value'];
            }
            return (0, inlinejs_1.GetGlobal)().CreateNothing();
        };
    }
    Get(key) {
        return this.getter_(key);
    }
}
exports.InplaceEachDirectiveProxyAccessHandler = InplaceEachDirectiveProxyAccessHandler;
function UseProxyAccessHandler(componentId, handler, callback) {
    var _a, _b;
    const oldHandler = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.SetProxyAccessHandler(handler);
    (0, inlinejs_1.JournalTry)(callback);
    (_b = (0, inlinejs_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.SetProxyAccessHandler(oldHandler || null);
}
exports.UseProxyAccessHandler = UseProxyAccessHandler;
class EachDirectiveEntry {
    constructor({ componentId, contextElement, keyInCollection, collection, initInfo, key, keyName, valueName }) {
        var _a, _b;
        this.key_ = null;
        this.componentId_ = componentId;
        this.contextElement_ = contextElement;
        this.key_ = key;
        this.id_ = ((_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('each_proxy_')) || '';
        this.keyInCollection_ = keyInCollection;
        this.getKeyInCollection_ = () => this.keyInCollection_;
        this.collection_ = collection;
        this.getCollection_ = () => this.collection_;
        const currentProxyAccessHandler = (_b = (0, inlinejs_1.FindComponentById)(componentId)) === null || _b === void 0 ? void 0 : _b.GetProxyAccessHandler();
        const parentProxy = ((currentProxyAccessHandler instanceof EachDirectiveProxyAccessHandler)
            ? currentProxyAccessHandler.GetProxy() : undefined);
        const id = this.id_, getCount = (list) => (Array.isArray(list) ? list.length : Object.keys(list).length), props = {
            collection: () => { var _a; return (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this); },
            count: () => {
                var _a;
                const collection = (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                return (collection ? getCount(collection) : 0);
            },
            index: () => {
                var _a;
                const key = (_a = this.getKeyInCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                return ((key || key === 0) ? key : '');
            },
            value: () => {
                var _a, _b;
                const collection = (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                const key = (_b = this.getKeyInCollection_) === null || _b === void 0 ? void 0 : _b.call(this);
                return collection && (key || key === 0) ? collection[key] : undefined;
            },
            parent: () => parentProxy,
        };
        this.propKeys_ = Object.keys(props);
        this.proxy_ = (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildProxyOptions)({
            getter: (prop) => {
                var _a;
                if (prop && props.hasOwnProperty(prop)) {
                    (prop !== 'parent') && ((_a = (0, inlinejs_1.GetGlobal)().GetCurrentProxyAccessStorage()) === null || _a === void 0 ? void 0 : _a.Put(componentId, `${id}.${prop}`));
                    return props[prop]();
                }
            },
            setter: (prop, value) => {
                var _a, _b, _c;
                if (prop === 'value') {
                    const collection = (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                    const key = (_b = this.getKeyInCollection_) === null || _b === void 0 ? void 0 : _b.call(this);
                    if (collection && (key || key === 0)) {
                        collection[key] = value;
                        (0, inlinejs_1.AddChanges)('set', `${this.id_}.value`, 'value', (_c = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes);
                        return true;
                    }
                }
                return false;
            },
            lookup: Object.keys(props), alert: { componentId, id },
        }));
        this.proxyAccessHandler_ = new EachDirectiveProxyAccessHandler({
            proxy: this.proxy_,
            keyName, valueName,
            parent: (parentProxy ? currentProxyAccessHandler : null),
        });
        this.cloneElement_ = initInfo.clone();
        (0, insert_1.InsertControlClone)({ componentId, contextElement,
            parent: initInfo.parent,
            clone: this.cloneElement_,
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false,
        });
        (0, inlinejs_1.ProcessDirectives)({
            component: componentId,
            element: this.cloneElement_,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
            proxyAccessHandler: this.proxyAccessHandler_,
        });
        this.cancelTransition_ = (0, inlinejs_1.WaitTransition)({ componentId, contextElement,
            target: this.cloneElement_,
            callback: () => (this.cancelTransition_ = null),
            reverse: false,
        });
    }
    /**
     * @description Updates the entry. This method is refactored to handle key changes and to
     * manage DOM position more reliably.
     * @param collection The new collection data.
     * @param keyInCollection The key of the item within the collection.
     * @param initInfo The control initialization info.
     * @param getNewKey A function to re-evaluate the key expression.
     * @param relativeEl The element to insert the clone before for correct DOM positioning.
     */
    Update(collection, keyInCollection, initInfo, getNewKey) {
        var _a;
        // Step 1: Check if the element still exists in the DOM.
        if (!this.contextElement_ || !this.cloneElement_ || !document.contains(this.cloneElement_)) {
            return;
        }
        // Step 2: Re-evaluate the key. If it has changed, we need to destroy this entry and create a new one.
        // This prevents state-related bugs from carrying over.
        const newKey = getNewKey();
        if (this.key_ !== newKey) {
            this.Destroy(); // Destroy the old entry and its DOM element
            // Since we destroy the old entry, we rely on the `LoopDirectiveHandler` to create a new one
            // in its place if needed. We return early here.
            return;
        }
        // Step 3: Update data and reposition the DOM element.
        // The DOM is now positioned correctly based on the `relativeEl` provided by the handler.
        (0, insert_1.InsertControlClone)({
            componentId: this.componentId_,
            contextElement: this.contextElement_,
            parent: initInfo.parent,
            clone: this.cloneElement_,
            relativeType: 'before',
            relative: this.contextElement_,
            processDirectives: false,
        });
        // Step 4: Update internal state.
        this.collection_ = collection;
        this.keyInCollection_ = keyInCollection;
        // Step 5: Alert changes to proxy keys
        const changes = (_a = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes;
        changes && this.propKeys_.filter(key => key !== 'parent').forEach(key => (0, inlinejs_1.AddChanges)('set', `${this.id_}.${key}`, key, changes, false));
    }
    Destroy() {
        var _a, _b, _c;
        (_a = this.cancelTransition_) === null || _a === void 0 ? void 0 : _a.call(this);
        this.cancelTransition_ = null;
        this.cloneElement_ && ((_c = (_b = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _b === void 0 ? void 0 : _b.FindElementScope(this.cloneElement_)) === null || _c === void 0 ? void 0 : _c.Destroy(true)); // Mark for delete - prevent further reactive updates
        const cleanup = () => {
            var _a, _b, _c;
            ((_a = this.cloneElement_) === null || _a === void 0 ? void 0 : _a.parentElement) && this.cloneElement_.remove();
            this.cloneElement_ && ((_c = (_b = (0, inlinejs_1.FindComponentById)(this.componentId_)) === null || _b === void 0 ? void 0 : _b.FindElementScope(this.cloneElement_)) === null || _c === void 0 ? void 0 : _c.Destroy());
            this.cloneElement_ = null;
            this.contextElement_ = null;
            this.proxyAccessHandler_ = null;
            this.getKeyInCollection_ = null;
            this.collection_ = null;
            this.getCollection_ = null;
            this.proxy_ = null;
        };
        if (this.contextElement_ && this.cloneElement_) {
            (0, inlinejs_1.WaitTransition)({
                componentId: this.componentId_,
                contextElement: this.contextElement_,
                target: this.cloneElement_,
                callback: cleanup,
                reverse: true,
            });
        }
        else {
            cleanup();
        }
    }
    GetKey() {
        return this.key_;
    }
    GetCloneElement() {
        return this.cloneElement_;
    }
}
exports.EachDirectiveEntry = EachDirectiveEntry;
/**
 * @description The main loop directive handler is refactored to use a Map for better key-based lookups
 * and to pass the correct relative element for DOM positioning.
 */
function LoopDirectiveHandler(matchedExpression, keyName, valueName, _a) {
    var _b, _c;
    var { componentId, component, contextElement, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "expression"]);
    let init = (0, init_1.InitControl)(Object.assign({ componentId, component, contextElement, expression: matchedExpression }, rest));
    if (!init) { //Failed to initialize
        return;
    }
    // Use a WeakMap for key-to-entry mapping to prevent memory leaks if the key is an object.
    const keyedItems = new Map();
    // We get the expression for the key, which remains constant.
    const resolvedKeyExpression = (0, inlinejs_1.GetDirectiveValue)(contextElement, 'bind:key', ':key') || null;
    const generateItems = (data, callback) => {
        let activeIndex = '';
        const proxyAccessHandler = resolvedKeyExpression ? new InplaceEachDirectiveProxyAccessHandler(() => data, () => activeIndex, keyName, valueName) : null;
        // A function to evaluate the key expression for the current item.
        const getCurrentKey = (callback) => {
            if (resolvedKeyExpression && proxyAccessHandler) {
                UseProxyAccessHandler(componentId, proxyAccessHandler, () => (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression: resolvedKeyExpression })(callback));
            }
            else {
                callback((0, inlinejs_1.GetGlobal)().CreateNothing());
            }
        };
        // We will store entries in a temporary list for cleanup.
        const currentEntries = new Map();
        callback((item, index, indexKey) => {
            activeIndex = index;
            getCurrentKey((key) => {
                var _a;
                let isNothing = (0, inlinejs_1.GetGlobal)().IsNothing(key);
                if (isNothing && indexKey) {
                    key = indexKey;
                    isNothing = false;
                }
                const existingEntry = keyedItems.get(key);
                if (!init) {
                    existingEntry === null || existingEntry === void 0 ? void 0 : existingEntry.Destroy();
                    keyedItems.delete(key);
                    return;
                }
                const validKey = isNothing ? index : key;
                if (existingEntry) { // Update the existing entry with the new data and DOM position.
                    existingEntry.Update(data, index, init, () => key);
                    currentEntries.set(key, existingEntry);
                }
                else { // Create a new entry and add it to the map.
                    const newEntry = new EachDirectiveEntry({
                        componentId, contextElement, keyName, valueName,
                        key: validKey,
                        initInfo: init,
                        keyInCollection: index,
                        collection: data,
                    });
                    keyedItems.has(validKey) && ((_a = keyedItems.get(validKey)) === null || _a === void 0 ? void 0 : _a.Destroy());
                    keyedItems.set(validKey, newEntry);
                    currentEntries.set(validKey, newEntry);
                }
            });
        }, () => {
            // Destroy all entries that are not in the current list.
            for (const [key, entry] of keyedItems) {
                if (!currentEntries.has(key)) {
                    entry.Destroy();
                    keyedItems.delete(key);
                }
            }
        });
    };
    const generateArrayItems = (data) => generateItems(data, (inserter, cleanup) => {
        data.forEach((item, index) => inserter(item, index));
        cleanup();
    });
    const generateMapItems = (data) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key, key));
        cleanup();
    });
    (_c = (_b = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.AddUninitCallback(() => {
        init = null;
        generateArrayItems([]);
        keyedItems.clear(); // Clear the map on un-initialization.
    });
    let firstEntry = true;
    init.effect((value) => {
        const checkpoint = ++init.checkpoint, component = (firstEntry ? (0, inlinejs_1.FindComponentById)(componentId) : null);
        (0, inlinejs_1.GetGlobal)().SuspendProxyAccessStorage(() => {
            (0, inlinejs_1.StreamData)(value, (value) => {
                if (checkpoint != (init === null || init === void 0 ? void 0 : init.checkpoint)) {
                    return;
                }
                (0, inlinejs_1.JournalTry)(() => {
                    if (Array.isArray(value)) {
                        generateArrayItems(value);
                    }
                    else if (typeof value === 'number') {
                        generateArrayItems((value < 0) ? Array.from(Array(-value).keys()).map(item => -(item + 1)) : Array.from(Array(value).keys()));
                    }
                    else if (typeof value === 'string') {
                        generateArrayItems(value.split(''));
                    }
                    else if ((0, inlinejs_1.IsObject)(value)) {
                        generateMapItems(value);
                    }
                }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
            });
        });
        firstEntry = false;
    });
}
exports.LoopDirectiveHandler = LoopDirectiveHandler;
exports.EachDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('each', (_a) => {
    var { expression } = _a, rest = __rest(_a, ["expression"]);
    expression = expression.trim(); // list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+?)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);
    matchedExpression = (matchedExpression || expression); //Use expression if no match
    if (!valueName) {
        valueName = keyName;
        keyName = '';
    }
    LoopDirectiveHandler(matchedExpression, keyName, valueName, Object.assign({ expression }, rest));
});
exports.ForDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('for', (_a) => {
    var { expression } = _a, rest = __rest(_a, ["expression"]);
    expression = expression.trim(); // value of list || (key, value) of list
    let [_, keyName, valueName, matchedExpression] = (expression.match(/^\(([A-Za-z_$][0-9A-Za-z_$]*),\s*([A-Za-z_$][0-9A-Za-z_$]*)\)\s+of\s+(.+?)$/) || []);
    !matchedExpression && ([_, valueName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+of\s+(.+?)$/) || []));
    !matchedExpression && ([_, keyName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+in\s+(.+?)$/) || []));
    LoopDirectiveHandler((matchedExpression || expression), keyName, valueName, Object.assign({ expression }, rest));
});
function EachDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.EachDirectiveHandler);
    (0, inlinejs_1.AddDirectiveHandler)(exports.ForDirectiveHandler);
}
exports.EachDirectiveHandlerCompact = EachDirectiveHandlerCompact;
