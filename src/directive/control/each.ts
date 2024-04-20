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
    public constructor(private options_: EachDirectiveProxyAccessHandlerOptions){}
    
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
    private getter_: (key: string | number) => any;
    
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
    private componentId_: string;
    private contextElement_: HTMLElement | null;
    
    private id_: string;
    private key_: any = null;

    private keyInCollection_: T;
    private getKeyInCollection_: (() => T) | null;

    private collection_: ListType<any>;
    private getCollection_: (() => ListType<any>) | null;
    
    private propKeys_: Array<string>;
    private proxy_: object | null;
    private proxyAccessHandler_: EachDirectiveProxyAccessHandler | null;

    private cloneElement_: HTMLElement | null;
    private cancelTransition_: (() => void) | null;
    
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
        const parentProxy = ((currentProxyAccessHandler && ('GetProxy' in currentProxyAccessHandler))
            ? (currentProxyAccessHandler as EachDirectiveProxyAccessHandler).GetProxy() : undefined);

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
                return (collection ? collection[<any>keyInCollection] : undefined);
            },
            parent: () => parentProxy,
        };

        this.propKeys_ = Object.keys(props);
        this.proxy_ = CreateInplaceProxy(BuildProxyOptions({ getter: (prop) => {
            if (prop && props.hasOwnProperty(prop)){
                (prop !== 'parent') && FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return props[prop]();
            }
        }, setter: (prop, value) => {
            if (prop === 'value'){
                const collection = this.getCollection_?.();
                if (collection){
                    collection[<any>keyInCollection] = value;
                    AddChanges('set', `${this.id_}.value`, 'value', FindComponentById(this.componentId_)?.GetBackend().changes)
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

    public Update(collection: ListType<any>, key: T, initInfo: IControlInitInfo, updateDomPosition = true){
        if (this.contextElement_ && this.cloneElement_ && document.contains(this.cloneElement_)){
            updateDomPosition && this.cloneElement_.parentElement?.insertBefore(this.cloneElement_, this.contextElement_);

            [...this.cloneElement_.attributes].forEach(attr => this.cloneElement_!.removeAttribute(attr.name));//Remove all attributes
            initInfo.getCloneAttributes().forEach(attr => this.cloneElement_!.setAttribute(attr.name, attr.value));//Copy attributes from clone

            this.collection_ = collection;
            this.keyInCollection_ = key;
            
            this.cancelTransition_?.();
            FindComponentById(this.componentId_)?.FindElementScope(this.cloneElement_)?.Destroy();
            
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

    public Destroy(){
        this.cancelTransition_?.();
        this.cancelTransition_ = null;

        this.contextElement_ && this.cloneElement_ && WaitTransition({
            componentId: this.componentId_,
            contextElement: this.contextElement_,
            target: this.cloneElement_,
            callback: () => {
                this.cloneElement_?.parentElement && this.cloneElement_.remove();
                this.cloneElement_ && FindComponentById(this.componentId_)?.FindElementScope(this.cloneElement_)?.Destroy();
                
                this.cloneElement_ = null;
                this.contextElement_ = null;
                
                this.proxyAccessHandler_ = null;
                this.getKeyInCollection_ = null;

                this.proxy_ = null;
            },
            reverse: true,
        });
    }

    public GetKey(){
        return this.key_;
    }
}

export function LoopDirectiveHandler(matchedExpression: string, keyName: string, valueName: string, { componentId, component, contextElement, expression, ...rest }: IDirectiveHandlerParams){
    let init = InitControl({ componentId, component, contextElement, expression: matchedExpression, ...rest });
    if (!init){//Failed to initialize
        return;
    }

    const resolvedKey = ((FindComponentById(componentId)?.FindElementScope(contextElement)?.GetKey()) || GetDirectiveValue(contextElement, 'bind:key', ':key') || '');
    
    let insertedItems: Array<EachDirectiveEntry<number | string>> | null = null, recentInsertions: Array<EachDirectiveEntry<number | string>> | null = null;
    const generateItems = (data: ListType<any>, callback: (inserter: (item: any, index: number | string) => void, cleanup: () => void) => void) => {
        let activeIndex: string | number = '';
        const proxyAccessHandler = resolvedKey ? new InplaceEachDirectiveProxyAccessHandler(
            () => data,
            () => activeIndex,
            keyName,
            valueName,
        ) : null;

        const getCurrentKey = (callback: (key: any) => void) => {
            if (resolvedKey && proxyAccessHandler){
                UseProxyAccessHandler(componentId, proxyAccessHandler, () => EvaluateLater({ componentId, contextElement, expression: resolvedKey })(callback));
            }
            else{
                callback(GetGlobal().CreateNothing());
            }
        };
        
        recentInsertions = new Array<EachDirectiveEntry<number | string>>();
        callback((item, index) => {
            activeIndex = index;
            getCurrentKey((key) => {
                const matched = resolvedKey && insertedItems && insertedItems.find(item => (item.GetKey() === key));
                if (!matched && init){
                    const entry = new EachDirectiveEntry({ componentId, contextElement, keyName, valueName, key,
                        initInfo: init,
                        keyInCollection: index,
                        collection: data,
                    });

                    recentInsertions?.push(entry);
                }
                else if (matched && init){//Use entry with matching key
                    recentInsertions?.push(matched);
                    matched.Update(data, index, init);
                }
            });
        }, () => {//Sync lists
            insertedItems && insertedItems.filter(entry => !recentInsertions?.includes(entry)).forEach(entry => entry.Destroy());
            insertedItems = recentInsertions;
        });
    };
    
    const generateArrayItems = (data: Array<any>) => generateItems(data, (inserter, cleanup) => {
        data.forEach(inserter);
        cleanup();
    });

    const generateMapItems = (data: Record<string, any>) => generateItems(data, (inserter, cleanup) => {
        Object.entries(data).forEach(([key, value]) => inserter(value, key));
        cleanup();
    });

    (component || FindComponentById(componentId))?.FindElementScope(contextElement)?.AddUninitCallback(() => {
        init = null;
        generateArrayItems([]);
    });

    let firstEntry = true;
    init.effect((value) => {
        let checkpoint = ++init!.checkpoint, component = (firstEntry ? FindComponentById(componentId) : null);
        
        component?.GetBackend().changes.PushGetAccessStorageSnapshot();//Prevent adding 'get access' entries
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

        component?.GetBackend().changes.PopGetAccessStorageSnapshot(false);
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
