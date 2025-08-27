import {
    FindComponentById,
    AddDirectiveHandler,
    CreateDirectiveHandlerCallback,
    EvaluateLater,
    StreamData,
    GetGlobal,
    JournalTry,
    AddChanges,
    BuildGetterProxyOptions,
    CreateInplaceProxy,
    IsObject,
    GetDirectiveValue,
    ProcessDirectives,
    WaitTransition,
    IProxyAccessHandler,
    IDirectiveHandlerParams,
    BuildProxyOptions,
    GetTarget,
} from "@benbraide/inlinejs";

import { IControlInitInfo, InitControl } from "./init";
import { InsertControlClone } from "./insert";

export type ListType<T> = Record<string, T> | Array<T>;

export interface EachDirectiveProxyAccessHandlerOptions{
    proxy: object;
    keyName?: string | null;
    valueName?: string | null;
    parent?: IProxyAccessHandler | null;
}

export interface IEachDirectiveEntryOptions<T extends string | number>{
    componentId: string;
    contextElement: HTMLElement;
    keyInCollection: T;
    collection: ListType<any>;
    initInfo: IControlInitInfo;
    key: any;
    keyName?: string | null;
    valueName?: string | null;
}

export class EachDirectiveProxyAccessHandler implements IProxyAccessHandler{
    public constructor(protected options_: EachDirectiveProxyAccessHandlerOptions){}
    
    public Get(key: string | number, target: object) {
        if (key === '$each'){
            return this.options_.proxy;
        }

        if (this.options_.keyName && key === this.options_.keyName){
            return this.options_.proxy['index'];
        }

        if (this.options_.valueName && key === this.options_.valueName){
            return this.options_.proxy['value'];
        }

        return ((this.options_.parent && this.options_.parent.Get) ? this.options_.parent.Get(key, target) : GetGlobal().CreateNothing());
    }

    public Set(key: string | number, value: any, target: object) {
        if (this.options_.valueName && key === this.options_.valueName){
            return (this.options_.proxy['value'] = value);
        }

        return ((this.options_.parent && this.options_.parent.Set) ? this.options_.parent.Set(key, value, target) : GetGlobal().CreateNothing());
    }

    public GetProxy(){
        return this.options_.proxy;
    }
}

export class InplaceEachDirectiveProxyAccessHandler implements IProxyAccessHandler{
    protected getter_: (key: string | number) => any;
    
    public constructor(getCollection: () => ListType<any>, getKeyInCollection: () => string | number, keyName?: string | null, valueName?: string | null){
        const getCount = (list: ListType<any>) => (Array.isArray(list) ? list.length : Object.keys(list).length), props = {
            collection: getCollection,
            count: () => getCount(getCollection()),
            index: getKeyInCollection,
            value: () => getCollection()[<any>getKeyInCollection()],
        };

        const proxy = CreateInplaceProxy(BuildGetterProxyOptions({ getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)){
                return props[prop]();
            }
        }, lookup: Object.keys(props) }));

        this.getter_ = (key) => {
            if (key === '$each'){
                return proxy;
            }
    
            if (keyName && key === keyName){
                return proxy['index'];
            }
    
            if (valueName && key === valueName){
                return proxy['value'];
            }
    
            return GetGlobal().CreateNothing();
        }
    }

    public Get(key: string | number) {
        return this.getter_(key);
    }
}

export function UseProxyAccessHandler(componentId: string, handler: IProxyAccessHandler, callback: () => void){
    const oldHandler = FindComponentById(componentId)?.SetProxyAccessHandler(handler);
    JournalTry(callback);
    FindComponentById(componentId)?.SetProxyAccessHandler(oldHandler || null);
}

export class EachDirectiveEntry<T extends string | number>{
    protected componentId_: string;
    protected contextElement_: HTMLElement | null;
    
    protected id_: string;
    protected key_: any = null;

    protected keyInCollection_: T;
    protected getKeyInCollection_: (() => T) | null;

    protected collection_: ListType<any> | null;
    protected getCollection_: (() => ListType<any> | null) | null;
    
    protected propKeys_: Array<string>;
    protected proxy_: object | null;
    protected proxyAccessHandler_: EachDirectiveProxyAccessHandler | null;

    protected cloneElement_: HTMLElement | null;
    protected cancelTransition_: (() => void) | null;
    
    public constructor({ componentId, contextElement, keyInCollection, collection, initInfo, key, keyName, valueName }: IEachDirectiveEntryOptions<T>){
        this.componentId_ = componentId;
        this.contextElement_ = contextElement;

        this.key_ = key;
        this.id_ = FindComponentById(componentId)?.GenerateUniqueId('each_proxy_') || '';
        
        this.keyInCollection_ = keyInCollection;
        this.getKeyInCollection_ = () => this.keyInCollection_;
        
        this.collection_ = collection;
        this.getCollection_ = () => this.collection_;

        const currentProxyAccessHandler = FindComponentById(componentId)?.GetProxyAccessHandler();
        const parentProxy = ((currentProxyAccessHandler instanceof EachDirectiveProxyAccessHandler)
            ? currentProxyAccessHandler.GetProxy() : undefined);

        const id = this.id_, getCount = (list: ListType<any>) => (Array.isArray(list) ? list.length : Object.keys(list).length), props = {
            collection: () => this.getCollection_?.(),
            count: () => {
                const collection = this.getCollection_?.();
                return (collection ? getCount(collection) : 0);
            },
            index: () => {
                const key = this.getKeyInCollection_?.();
                return ((key || key === 0) ? key : '');
            },
            value: () => {
                const collection = this.getCollection_?.();
                const key = this.getKeyInCollection_?.();
                return collection && (key || key === 0) ? collection[<any>key] : undefined;
            },
            parent: () => parentProxy,
        };

        this.propKeys_ = Object.keys(props);
        this.proxy_ = CreateInplaceProxy(BuildProxyOptions({
            getter: (prop) => {
                if (prop && props.hasOwnProperty(prop)){
                    (prop !== 'parent') && GetGlobal().GetCurrentProxyAccessStorage()?.Put(componentId, `${id}.${prop}`);
                    return props[prop]();
                }
            },
            setter: (prop, value) => {
                if (prop === 'value'){
                    const collection = this.getCollection_?.();
                    const key = this.getKeyInCollection_?.();
                    if (collection && (key || key === 0)){
                        collection[<any>key] = value;
                        AddChanges('set', `${this.id_}.value`, 'value', FindComponentById(this.componentId_)?.GetBackend().changes);
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

    /**
     * @description Updates the entry. This method is refactored to handle key changes and to
     * manage DOM position more reliably.
     * @param collection The new collection data.
     * @param keyInCollection The key of the item within the collection.
     * @param initInfo The control initialization info.
     * @param getNewKey A function to re-evaluate the key expression.
     * @param relativeEl The element to insert the clone before for correct DOM positioning.
     */
    public Update(
        collection: ListType<any>,
        keyInCollection: T,
        initInfo: IControlInitInfo,
        getNewKey: () => any,
    ){
        // Step 1: Check if the element still exists in the DOM.
        if (!this.contextElement_ || !this.cloneElement_ || !document.contains(this.cloneElement_)){
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
        InsertControlClone({
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
        const changes = FindComponentById(this.componentId_)?.GetBackend().changes;
        
        changes && this.propKeys_.filter(key => key !== 'parent').forEach(key => AddChanges('set', `${this.id_}.${key}`, key, changes, false));
    }

    public Destroy(){
        this.cancelTransition_?.();
        this.cancelTransition_ = null;

        this.cloneElement_ && FindComponentById(this.componentId_)?.FindElementScope(this.cloneElement_)?.Destroy(true);// Mark for delete - prevent further reactive updates
        
        const cleanup = () => {
            this.cloneElement_?.parentElement && this.cloneElement_.remove();
            this.cloneElement_ && FindComponentById(this.componentId_)?.FindElementScope(this.cloneElement_)?.Destroy();
            
            this.cloneElement_ = null;
            this.contextElement_ = null;
            
            this.proxyAccessHandler_ = null;
            this.getKeyInCollection_ = null;

            this.collection_ = null;
            this.getCollection_ = null;
            
            this.proxy_ = null;
        };
        
        if (this.contextElement_ && this.cloneElement_){
            WaitTransition({
                componentId: this.componentId_,
                contextElement: this.contextElement_,
                target: this.cloneElement_,
                callback: cleanup,
                reverse: true,
            });
        }
        else{
            cleanup();
        }
    }

    public GetKey(){
        return this.key_;
    }

    public GetCloneElement(){
        return this.cloneElement_;
    }
}

/**
 * @description The main loop directive handler is refactored to use a Map for better key-based lookups
 * and to pass the correct relative element for DOM positioning.
 */
export function LoopDirectiveHandler(matchedExpression: string, keyName: string, valueName: string, { componentId, component, contextElement, expression, ...rest }: IDirectiveHandlerParams){
    let init = InitControl({ componentId, component, contextElement, expression: matchedExpression, ...rest });
    if (!init){//Failed to initialize
        return;
    }

    // Use a WeakMap for key-to-entry mapping to prevent memory leaks if the key is an object.
    const keyedItems = new Map<any, EachDirectiveEntry<number | string>>();
    
    // We get the expression for the key, which remains constant.
    const resolvedKeyExpression = GetDirectiveValue(contextElement, 'bind:key', ':key') || null;

    const generateItems = (data: ListType<any>, callback: (inserter: (item: any, index: number | string, indexKey?: string) => void, cleanup: () => void) => void) => {
        let activeIndex: string | number = '';

        const proxyAccessHandler = resolvedKeyExpression ? new InplaceEachDirectiveProxyAccessHandler(
            () => data,
            () => activeIndex,
            keyName,
            valueName,
        ) : null;

        // A function to evaluate the key expression for the current item.
        const getCurrentKey = (callback: (key: any) => void) => {
            if (resolvedKeyExpression && proxyAccessHandler){
                UseProxyAccessHandler(componentId, proxyAccessHandler, () => EvaluateLater({ componentId, contextElement, expression: resolvedKeyExpression })(callback));
            }
            else{
                callback(GetGlobal().CreateNothing());
            }
        };
        
        // We will store entries in a temporary list for cleanup.
        const currentEntries = new Map<any, EachDirectiveEntry<number | string>>();

        callback((item, index, indexKey?: string) => {
            activeIndex = index;
            getCurrentKey((key) => {
                let isNothing = GetGlobal().IsNothing(key);
                if (isNothing && indexKey){
                    key = indexKey;
                    isNothing = false;
                }
                
                const existingEntry = keyedItems.get(key);
                if (!init){
                    existingEntry?.Destroy();
                    keyedItems.delete(key);
                    return;
                }

                const validKey = isNothing ? index : key;
                
                if (existingEntry) {// Update the existing entry with the new data and DOM position.
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

                    keyedItems.has(validKey) && keyedItems.get(validKey)?.Destroy();
                    keyedItems.set(validKey, newEntry);
                    currentEntries.set(validKey, newEntry);
                }
            });
        }, () => { // Cleanup function.
            // Destroy all entries that are not in the current list.
            for (const [key, entry] of keyedItems) {
                if (!currentEntries.has(key)) {
                    entry.Destroy();
                    keyedItems.delete(key);
                }
            }
        });
    };
    
    const generateArrayItems = (data: Array<any>) => generateItems(data, (inserter, cleanup) => {
        data.forEach((item, index) => inserter(item, index));
        cleanup();
    });

    const generateMapItems = (data: Record<string, any>) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key, key));
        cleanup();
    });

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
        init = null;
        generateArrayItems([]);
        keyedItems.clear(); // Clear the map on un-initialization.
    });

    let firstEntry = true;
    init.effect((value) => {
        const checkpoint = ++init!.checkpoint, component = (firstEntry ? FindComponentById(componentId) : null);
        
        GetGlobal().SuspendProxyAccessStorage(() => {
            StreamData(value, (value) => {
                if (checkpoint != init?.checkpoint){
                    return;
                }

                JournalTry(() => {
                    if (Array.isArray(value)){
                        generateArrayItems(value);
                    }
                    else if (typeof value === 'number'){
                        generateArrayItems((value < 0) ? Array.from(Array(-value).keys()).map(item => -(item + 1)) : Array.from(Array(value).keys()));
                    }
                    else if (typeof value === 'string'){
                        generateArrayItems(value.split(''));
                    }
                    else if (IsObject(value)){
                        generateMapItems(value);
                    }
                }), 'InlineJS.EachDirectiveHandler.Effect', contextElement;
            });
        });
        
        firstEntry = false;
    });
}

export const EachDirectiveHandler = CreateDirectiveHandlerCallback('each', ({ expression, ...rest }) => {
    expression = expression.trim();// list as value || list as key => value
    let [_, matchedExpression, keyName, __, valueName] = (expression.match(/^(.+?)?\s+as\s+([A-Za-z_$][0-9A-Za-z_$]*)(\s*=>\s*([A-Za-z_$][0-9A-Za-z_$]*))?$/) || []);

    matchedExpression = (matchedExpression || expression);//Use expression if no match
    if (!valueName){
        valueName = keyName;
        keyName = '';
    }

    LoopDirectiveHandler(matchedExpression, keyName, valueName, { expression, ...rest });
});

export const ForDirectiveHandler = CreateDirectiveHandlerCallback('for', ({ expression, ...rest }) => {
    expression = expression.trim();// value of list || (key, value) of list

    let [_, keyName, valueName, matchedExpression] = (expression.match(/^\(([A-Za-z_$][0-9A-Za-z_$]*),\s*([A-Za-z_$][0-9A-Za-z_$]*)\)\s+of\s+(.+?)$/) || []);

    !matchedExpression && ([_, valueName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+of\s+(.+?)$/) || []));
    !matchedExpression && ([_, keyName, matchedExpression] = (expression.match(/^([A-Za-z_$][0-9A-Za-z_$]*)\s+in\s+(.+?)$/) || []));

    LoopDirectiveHandler((matchedExpression || expression), keyName, valueName, { expression, ...rest });
});

export function EachDirectiveHandlerCompact(){
    AddDirectiveHandler(EachDirectiveHandler);
    AddDirectiveHandler(ForDirectiveHandler);
}
