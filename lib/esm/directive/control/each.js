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
import { FindComponentById, AddDirectiveHandler, CreateDirectiveHandlerCallback, EvaluateLater, StreamData, GetGlobal, JournalTry, AddChanges, BuildGetterProxyOptions, CreateInplaceProxy, IsObject, GetDirectiveValue, ProcessDirectives, WaitTransition, BuildProxyOptions, } from "@benbraide/inlinejs";
import { InitControl } from "./init";
import { InsertControlClone } from "./insert";
export class EachDirectiveProxyAccessHandler {
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
        return ((this.options_.parent && this.options_.parent.Get) ? this.options_.parent.Get(key, target) : GetGlobal().CreateNothing());
    }
    Set(key, value, target) {
        if (this.options_.valueName && key === this.options_.valueName) {
            return (this.options_.proxy['value'] = value);
        }
        return ((this.options_.parent && this.options_.parent.Set) ? this.options_.parent.Set(key, value, target) : GetGlobal().CreateNothing());
    }
    GetProxy() {
        return this.options_.proxy;
    }
}
export class InplaceEachDirectiveProxyAccessHandler {
    constructor(getCollection, getKeyInCollection, keyName, valueName) {
        const getCount = (list) => (Array.isArray(list) ? list.length : Object.keys(list).length), props = {
            collection: getCollection,
            count: () => getCount(getCollection()),
            index: getKeyInCollection,
            value: () => getCollection()[getKeyInCollection()],
        };
        const proxy = CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
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
            return GetGlobal().CreateNothing();
        };
    }
    Get(key) {
        return this.getter_(key);
    }
}
export function UseProxyAccessHandler(componentId, handler, callback) {
    var _a, _b;
    const oldHandler = (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.SetProxyAccessHandler(handler);
    JournalTry(callback);
    (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.SetProxyAccessHandler(oldHandler || null);
}
export class EachDirectiveEntry {
    constructor({ componentId, contextElement, keyInCollection, collection, initInfo, key, keyName, valueName }) {
        var _a, _b;
        this.key_ = null;
        this.componentId_ = componentId;
        this.contextElement_ = contextElement;
        this.key_ = key;
        this.id_ = ((_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GenerateUniqueId('each_proxy_')) || '';
        this.keyInCollection_ = keyInCollection;
        this.getKeyInCollection_ = () => this.keyInCollection_;
        this.collection_ = collection;
        this.getCollection_ = () => this.collection_;
        const currentProxyAccessHandler = (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetProxyAccessHandler();
        const parentProxy = ((currentProxyAccessHandler && ('GetProxy' in currentProxyAccessHandler))
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
                var _a;
                const collection = (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                return (collection ? collection[keyInCollection] : undefined);
            },
            parent: () => parentProxy,
        };
        this.propKeys_ = Object.keys(props);
        this.proxy_ = CreateInplaceProxy(BuildProxyOptions({ getter: (prop) => {
                var _a;
                if (prop && props.hasOwnProperty(prop)) {
                    (prop !== 'parent') && ((_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`));
                    return props[prop]();
                }
            }, setter: (prop, value) => {
                var _a, _b;
                if (prop === 'value') {
                    const collection = (_a = this.getCollection_) === null || _a === void 0 ? void 0 : _a.call(this);
                    if (collection) {
                        collection[keyInCollection] = value;
                        AddChanges('set', `${this.id_}.value`, 'value', (_b = FindComponentById(this.componentId_)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes);
                        return true;
                    }
                }
                return false;
            }, lookup: Object.keys(props), alert: { componentId, id } }));
        this.proxyAccessHandler_ = new EachDirectiveProxyAccessHandler({
            proxy: this.proxy_,
            keyName, valueName,
            parent: (parentProxy ? currentProxyAccessHandler : null),
        });
        this.cloneElement_ = initInfo.clone();
        InsertControlClone({ componentId, contextElement,
            parent: initInfo.parent,
            clone: this.cloneElement_,
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false,
        });
        ProcessDirectives({
            component: componentId,
            element: this.cloneElement_,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
            proxyAccessHandler: this.proxyAccessHandler_,
        });
        this.cancelTransition_ = WaitTransition({ componentId, contextElement,
            target: this.cloneElement_,
            callback: () => (this.cancelTransition_ = null),
            reverse: false,
        });
    }
    Update(collection, key, initInfo, updateDomPosition = true) {
        var _a, _b, _c, _d;
        if (this.contextElement_ && this.cloneElement_ && document.contains(this.cloneElement_)) {
            updateDomPosition && ((_a = this.cloneElement_.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.cloneElement_, this.contextElement_));
            [...this.cloneElement_.attributes].forEach(attr => this.cloneElement_.removeAttribute(attr.name)); //Remove all attributes
            initInfo.getCloneAttributes().forEach(attr => this.cloneElement_.setAttribute(attr.name, attr.value)); //Copy attributes from clone
            this.collection_ = collection;
            this.keyInCollection_ = key;
            (_b = this.cancelTransition_) === null || _b === void 0 ? void 0 : _b.call(this);
            (_d = (_c = FindComponentById(this.componentId_)) === null || _c === void 0 ? void 0 : _c.FindElementScope(this.cloneElement_)) === null || _d === void 0 ? void 0 : _d.Destroy();
            ProcessDirectives({
                component: this.componentId_,
                element: this.cloneElement_,
                options: {
                    checkDocument: false,
                    checkTemplate: true,
                },
                proxyAccessHandler: this.proxyAccessHandler_,
            });
            this.cancelTransition_ = WaitTransition({
                componentId: this.componentId_,
                contextElement: this.contextElement_,
                target: this.cloneElement_,
                callback: () => (this.cancelTransition_ = null),
                reverse: false,
            });
        }
    }
    Destroy() {
        var _a;
        (_a = this.cancelTransition_) === null || _a === void 0 ? void 0 : _a.call(this);
        this.cancelTransition_ = null;
        this.contextElement_ && this.cloneElement_ && WaitTransition({
            componentId: this.componentId_,
            contextElement: this.contextElement_,
            target: this.cloneElement_,
            callback: () => {
                var _a, _b, _c;
                ((_a = this.cloneElement_) === null || _a === void 0 ? void 0 : _a.parentElement) && this.cloneElement_.remove();
                this.cloneElement_ && ((_c = (_b = FindComponentById(this.componentId_)) === null || _b === void 0 ? void 0 : _b.FindElementScope(this.cloneElement_)) === null || _c === void 0 ? void 0 : _c.Destroy());
                this.cloneElement_ = null;
                this.contextElement_ = null;
                this.proxyAccessHandler_ = null;
                this.getKeyInCollection_ = null;
                this.proxy_ = null;
            },
            reverse: true,
        });
    }
    GetKey() {
        return this.key_;
    }
}
export function LoopDirectiveHandler(matchedExpression, keyName, valueName, _a) {
    var _b, _c, _d, _e;
    var { componentId, component, contextElement, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "expression"]);
    let init = InitControl(Object.assign({ componentId, component, contextElement, expression: matchedExpression }, rest));
    if (!init) { //Failed to initialize
        return;
    }
    const resolvedKey = (((_c = (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.GetKey()) || GetDirectiveValue(contextElement, 'bind:key', ':key') || '');
    let insertedItems = null, recentInsertions = null;
    const generateItems = (data, callback) => {
        let activeIndex = '';
        const proxyAccessHandler = resolvedKey ? new InplaceEachDirectiveProxyAccessHandler(() => data, () => activeIndex, keyName, valueName) : null;
        const getCurrentKey = (callback) => {
            if (resolvedKey && proxyAccessHandler) {
                UseProxyAccessHandler(componentId, proxyAccessHandler, () => EvaluateLater({ componentId, contextElement, expression: resolvedKey })(callback));
            }
            else {
                callback(GetGlobal().CreateNothing());
            }
        };
        recentInsertions = new Array();
        callback((item, index) => {
            activeIndex = index;
            getCurrentKey((key) => {
                const matched = resolvedKey && insertedItems && insertedItems.find(item => (item.GetKey() === key));
                if (!matched && init) {
                    const entry = new EachDirectiveEntry({ componentId, contextElement, keyName, valueName, key,
                        initInfo: init,
                        keyInCollection: index,
                        collection: data,
                    });
                    recentInsertions === null || recentInsertions === void 0 ? void 0 : recentInsertions.push(entry);
                }
                else if (matched && init) { //Use entry with matching key
                    recentInsertions === null || recentInsertions === void 0 ? void 0 : recentInsertions.push(matched);
                    matched.Update(data, index, init);
                }
            });
        }, () => {
            insertedItems && insertedItems.filter(entry => !(recentInsertions === null || recentInsertions === void 0 ? void 0 : recentInsertions.includes(entry))).forEach(entry => entry.Destroy());
            insertedItems = recentInsertions;
        });
    };
    const generateArrayItems = (data) => generateItems(data, (inserter, cleanup) => {
        data.forEach(inserter);
        cleanup();
    });
    const generateMapItems = (data) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key));
        cleanup();
    });
    (_e = (_d = (component || FindComponentById(componentId))) === null || _d === void 0 ? void 0 : _d.FindElementScope(contextElement)) === null || _e === void 0 ? void 0 : _e.AddUninitCallback(() => {
        init = null;
        generateArrayItems([]);
    });
    let firstEntry = true;
    init.effect((value) => {
        let checkpoint = ++init.checkpoint, component = (firstEntry ? FindComponentById(componentId) : null);
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PushGetAccessStorageSnapshot(); //Prevent adding 'get access' entries
        StreamData(value, (value) => {
            if (checkpoint != (init === null || init === void 0 ? void 0 : init.checkpoint)) {
                return;
            }
            JournalTry(() => {
                if (Array.isArray(value)) {
                    generateArrayItems(value);
                }
                else if (typeof value === 'number') {
                    generateArrayItems((value < 0) ? Array.from(Array(-value).keys()).map(item => -(item + 1)) : Array.from(Array(value).keys()));
                }
                else if (typeof value === 'string') {
                    generateArrayItems(value.split(''));
                }
                else if (IsObject(value)) {
                    generateMapItems(value);
                }
            }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
        });
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        firstEntry = false;
    });
}
export const EachDirectiveHandler = CreateDirectiveHandlerCallback('each', (_a) => {
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
export const ForDirectiveHandler = CreateDirectiveHandlerCallback('for', (_a) => {
    var { expression } = _a, rest = __rest(_a, ["expression"]);
    expression = expression.trim(); // value of list || (key, value) of list
    let [_, keyName, valueName, matchedExpression] = (expression.match(/^\(([A-Za-z_$][0-9A-Za-z_$]*),\s*([A-Za-z_$][0-9A-Za-z_$]*)\)\s+of\s+(.+?)$/) || []);
    !matchedExpression && ([_, valueName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+of\s+(.+?)$/) || []));
    !matchedExpression && ([_, keyName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+in\s+(.+?)$/) || []));
    LoopDirectiveHandler((matchedExpression || expression), keyName, valueName, Object.assign({ expression }, rest));
});
export function EachDirectiveHandlerCompact() {
    AddDirectiveHandler(EachDirectiveHandler);
    AddDirectiveHandler(ForDirectiveHandler);
}
