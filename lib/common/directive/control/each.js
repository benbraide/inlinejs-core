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
exports.EachDirectiveHandlerCompact = exports.EachDirectiveHandler = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const init_1 = require("./init");
const insert_1 = require("./insert");
exports.EachDirectiveHandler = (0, inlinejs_1.CreateDirectiveHandlerCallback)('each', (_a) => {
    var _b, _c, _d, _e;
    var { componentId, component, contextElement, expression } = _a, rest = __rest(_a, ["componentId", "component", "contextElement", "expression"]);
    expression = expression.trim(); // list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+?)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);
    matchedExpression = (matchedExpression || expression); //Use expression if no match
    if (!valueName) {
        valueName = keyName;
        keyName = '';
    }
    let init = (0, init_1.InitControl)(Object.assign({ componentId, component, contextElement, expression: matchedExpression }, rest));
    if (!init) { //Failed to initialize
        return;
    }
    let key = (((_c = (_b = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _b === void 0 ? void 0 : _b.FindElementScope(contextElement)) === null || _c === void 0 ? void 0 : _c.GetKey()) || null);
    if (!key) { //Check if attribute is present
        key = (0, inlinejs_1.GetDirectiveValue)(contextElement, 'key', ':key');
    }
    let evaluateKey = (key ? (0, inlinejs_1.EvaluateLater)({ componentId, contextElement, expression: key }) : null), getKey = (index, list) => {
        if (!evaluateKey) {
            return '';
        }
        let component = (0, inlinejs_1.FindComponentById)(componentId), elementScope = component === null || component === void 0 ? void 0 : component.FindElementScope(contextElement), targetList = (0, inlinejs_1.GetTarget)(list);
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$each', { index,
            collection: targetList,
            count: targetList.length,
            value: targetList[index],
            parent: component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, '$each', true),
        });
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(keyName, index);
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(valueName, targetList[index]);
        }
        let result = evaluateKey();
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal('$each');
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal(keyName);
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.DeleteLocal(valueName);
        }
        return result;
    };
    let getCount = (list) => (Array.isArray(list) ? list.length : Object.keys(list).length);
    let createProxy = (component, data, value, index, parent) => {
        let state = { collection: data, count: getCount(data), index, value, parent }, id = component.GenerateUniqueId('each_proxy_');
        return {
            proxy: (0, inlinejs_1.CreateInplaceProxy)((0, inlinejs_1.BuildGetterProxyOptions)({ getter: (prop) => {
                    var _a;
                    if (prop && state.hasOwnProperty(prop)) {
                        (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                        return state[prop];
                    }
                }, lookup: [...Object.keys(state)], alert: { componentId, id } })),
            refresh: (entries) => {
                Object.entries(entries).forEach(([key, value]) => {
                    var _a;
                    if (state.hasOwnProperty(key) && !(0, inlinejs_1.IsEqual)(state[key], value)) {
                        state[key] = value;
                        (0, inlinejs_1.AddChanges)('set', `${id}.${key}`, key, (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                    }
                });
            },
        };
    };
    let list = null;
    let insert = (data, item, index, newList, key) => {
        let clone = null, component = (0, inlinejs_1.FindComponentById)(componentId);
        if (!component) {
            return;
        }
        (0, insert_1.InsertControlClone)({ componentId, contextElement,
            parent: init.parent,
            clone: (clone = init.clone()),
            relativeType: 'before',
            relative: contextElement,
            processDirectives: false, });
        let elementScope = component.CreateElementScope(clone);
        let proxyInfo = createProxy(component, data, item, index, component === null || component === void 0 ? void 0 : component.FindElementLocalValue(contextElement, '$each', true));
        let entryInfo = { proxyInfo,
            item: clone,
            transitionCancel: null,
            checkpoint: 0,
        };
        Array.isArray(newList) ? newList.push(entryInfo) : (newList[index] = entryInfo);
        if (key) {
            clone.setAttribute('key', key);
        }
        elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal('$each', proxyInfo.proxy);
        if (keyName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(keyName, (0, inlinejs_1.GetGlobal)().CreateFuture(() => proxyInfo.proxy['index']));
        }
        if (valueName) {
            elementScope === null || elementScope === void 0 ? void 0 : elementScope.SetLocal(valueName, (0, inlinejs_1.GetGlobal)().CreateFuture(() => proxyInfo.proxy['value']));
        }
        (0, inlinejs_1.ProcessDirectives)({
            component: component,
            element: clone,
            options: {
                checkDocument: false,
                checkTemplate: true,
            },
        });
        entryInfo.checkpoint += 1;
        entryInfo.transitionCancel && entryInfo.transitionCancel();
        let myCheckpoint = ++entryInfo.checkpoint;
        entryInfo.transitionCancel = (0, inlinejs_1.WaitTransition)({ componentId, contextElement,
            target: clone,
            callback: () => {
                if (myCheckpoint == entryInfo.checkpoint) {
                    entryInfo.transitionCancel = null;
                }
            },
            reverse: false,
        });
    };
    let remove = (info) => {
        let myCheckpoint = ++info.checkpoint;
        info.transitionCancel && info.transitionCancel();
        info.transitionCancel = (0, inlinejs_1.WaitTransition)({ componentId, contextElement,
            target: info.item,
            callback: () => {
                var _a, _b;
                if (myCheckpoint == info.checkpoint) {
                    info.transitionCancel = null;
                    if (info.item.parentElement) {
                        info.item.remove();
                        (_b = (_a = (0, inlinejs_1.FindComponentById)(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementScope(info.item)) === null || _b === void 0 ? void 0 : _b.Destroy();
                    }
                }
            },
            reverse: true, });
    };
    let generateItems = (data, callback) => {
        let newList = (Array.isArray(data) ? new Array() : {}), oldList = list;
        list = ((Array.isArray(data) == Array.isArray(list)) ? list : null);
        callback((item, index) => {
            let infoWithKey = null, key = null;
            if (Array.isArray(data)) {
                key = (0, inlinejs_1.ToString)(getKey(index, data));
                infoWithKey = ((list && key && list.find(({ item }) => (item.getAttribute('key') === key))) || null);
            }
            else if (list && list.hasOwnProperty(index)) {
                infoWithKey = list[index];
            }
            if (infoWithKey) { //Reuse element
                Array.isArray(newList) ? newList.push(infoWithKey) : (newList[index] = infoWithKey);
                infoWithKey.item.parentElement.insertBefore(infoWithKey.item, contextElement); //Move to update position
                infoWithKey.proxyInfo.refresh({ collection: data, value: item, index, count: getCount(data) });
            }
            else { //Create new
                insert(data, item, index, newList, key);
            }
        }, () => {
            if (Array.isArray(oldList)) {
                oldList.filter(info => !newList.includes(info)).forEach(remove);
            }
            else if (list) {
                Object.entries(oldList).filter(([key]) => !(key in newList)).forEach(([key, info]) => remove(info));
            }
            list = newList;
        });
    };
    let generateArrayItems = (data) => generateItems(data, (inserter, cleanup) => {
        data.forEach(inserter);
        cleanup();
    });
    let generateMapItems = (data) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key));
        cleanup();
    });
    (_e = (_d = (component || (0, inlinejs_1.FindComponentById)(componentId))) === null || _d === void 0 ? void 0 : _d.FindElementScope(contextElement)) === null || _e === void 0 ? void 0 : _e.AddUninitCallback(() => generateArrayItems([]));
    let firstEntry = true;
    init.effect((value) => {
        let checkpoint = ++init.checkpoint, component = (firstEntry ? (0, inlinejs_1.FindComponentById)(componentId) : null);
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PushGetAccessStorageSnapshot(); //Prevent adding 'get access' entries
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
                else if ((0, inlinejs_1.IsObject)(value)) {
                    generateMapItems(value);
                }
            }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
        });
        component === null || component === void 0 ? void 0 : component.GetBackend().changes.PopGetAccessStorageSnapshot(false);
        firstEntry = false;
    });
});
function EachDirectiveHandlerCompact() {
    (0, inlinejs_1.AddDirectiveHandler)(exports.EachDirectiveHandler);
}
exports.EachDirectiveHandlerCompact = EachDirectiveHandlerCompact;
